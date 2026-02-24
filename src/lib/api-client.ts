export async function fetchClient<T>(url: string, options: { timeout?: number, retries?: number } & RequestInit = {}): Promise<T> {
  const { timeout = 8000, retries = 2, ...customOptions } = options;
  for (let i = 0; i <= retries; i++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    const signal = customOptions.signal || controller.signal;
    try {
      const headers = new Headers(customOptions.headers);
      if (!(customOptions.body instanceof FormData) && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }
      const response = await fetch(url, { ...customOptions, headers, signal });
      clearTimeout(timeoutId);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.message || `HTTP Error: ${response.status}`);
        (error as any).status = response.status;
        throw error;
      }
      return (await response.json()) as T;
    } catch (error: any) {
      clearTimeout(timeoutId);
      const isRetryable = error.name === 'TypeError' || (error.status && error.status >= 500);
      if (i === retries || !isRetryable) throw error;
      await new Promise(res => setTimeout(res, 1000 * Math.pow(2, i)));
    }
  }
  throw new Error("Unreachable");
}
