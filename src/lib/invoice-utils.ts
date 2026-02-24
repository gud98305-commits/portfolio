import { LineItem, AdditionalCharge, InvoiceTotals } from "@/types/documents";

/**
 * Formats a numeric string as currency based on the provided code.
 */
export function formatMoney(amount: string, currency: string): string {
  const num = parseFloat(amount) || 0;
  
  const options: Intl.NumberFormatOptions = {
    style: "currency",
    currency: currency,
    minimumFractionDigits: currency === "KRW" || currency === "JPY" ? 0 : 2,
    maximumFractionDigits: currency === "KRW" || currency === "JPY" ? 0 : 2,
  };

  try {
    return new Intl.NumberFormat("en-US", options).format(num);
  } catch (e) {
    // Fallback if currency code is invalid
    return `${currency} ${num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
  }
}

/**
 * Calculates line item amount with precision.
 */
export function calculateLineAmount(quantity: number, unitPrice: string): string {
  const price = parseFloat(unitPrice) || 0;
  return (quantity * price).toFixed(2);
}

/**
 * Calculates totals for the entire invoice.
 */
export function calculateTotals(
  items: LineItem[],
  freight: string,
  insurance: string,
  additionalCharges: AdditionalCharge[],
  discount: string
): Omit<InvoiceTotals, "amount_in_words"> {
  const subtotalNum = items.reduce((acc, item) => acc + (parseFloat(item.amount) || 0), 0);
  const freightNum = parseFloat(freight) || 0;
  const insuranceNum = parseFloat(insurance) || 0;
  const chargesNum = additionalCharges.reduce((acc, c) => acc + (parseFloat(c.amount) || 0), 0);
  const discountNum = parseFloat(discount) || 0;

  const totalNum = subtotalNum + freightNum + insuranceNum + chargesNum - discountNum;

  return {
    subtotal: subtotalNum.toFixed(2),
    freight: freightNum.toFixed(2),
    insurance: insuranceNum.toFixed(2),
    additional_charges: additionalCharges,
    discount: discountNum.toFixed(2),
    total_amount: totalNum.toFixed(2),
  };
}

/**
 * Converts a number to its English word representation.
 */
export function numberToWords(amount: string, currency: string): string {
  const num = parseFloat(amount) || 0;
  const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const scales = ["", "Thousand", "Million", "Billion"];

  function convertChunk(n: number): string {
    let chunkStr = "";
    if (n >= 100) {
      chunkStr += units[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }
    if (n >= 20) {
      chunkStr += tens[Math.floor(n / 10)] + (n % 10 !== 0 ? "-" + units[n % 10] : "") + " ";
    } else if (n > 0) {
      chunkStr += units[n] + " ";
    }
    return chunkStr;
  }

  const integerPart = Math.floor(num);
  const decimalPart = Math.round((num - integerPart) * 100);

  let result = "SAY " + currency + " ";
  
  if (integerPart === 0) {
    result += "Zero ";
  } else {
    let numStr = integerPart.toString();
    let chunks: number[] = [];
    while (numStr.length > 0) {
      chunks.push(parseInt(numStr.slice(-3)));
      numStr = numStr.slice(0, -3);
    }

    for (let i = chunks.length - 1; i >= 0; i--) {
      if (chunks[i] > 0) {
        result += convertChunk(chunks[i]) + scales[i] + " ";
      }
    }
  }

  if (decimalPart > 0) {
    result += "AND CENTS " + convertChunk(decimalPart);
  }

  return result.trim().toUpperCase() + " ONLY";
}
