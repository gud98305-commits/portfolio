import { NextResponse } from "next/server";
import { CommercialInvoice, PackingList, SalesContract, DocumentType } from "@/types/documents";
import { calculateTotals, numberToWords, calculateLineAmount } from "@/lib/invoice-utils";

const demoInvoiceBase: CommercialInvoice = {
  invoice_no: "SY-2024-1024",
  date: new Date().toISOString().split('T')[0],
  shipper: {
    company_name: "AMORE BEAUTY CO., LTD.",
    address: "100 Hangang-daero, Yongsan-gu, Seoul, Republic of Korea",
    tel: "+82-2-1234-5678",
    email: "export@amorebeauty.kr",
    tax_id: "123-45-67890",
  },
  consignee: {
    company_name: "COSMO TRADING SDN. BHD.",
    address: "Level 25, Menara Trade, 50450 Kuala Lumpur, Malaysia",
    tel: "+60-3-2166-0000",
    email: "procurement@cosmotrading.my",
    tax_id: "MY-201234567",
  },
  notify_party: {
    company_name: "FAST TRACK LOGISTICS MY",
    note: "PLEASE NOTIFY UPON ARRIVAL AT PORT",
  },
  shipment_details: {
    place_of_receipt: "SEOUL, KOREA",
    port_of_loading: "BUSAN, KOREA",
    port_of_discharge: "PORT KLANG, MALAYSIA",
    place_of_delivery: "KUALA LUMPUR, MALAYSIA",
    vessel_or_vehicle: "EVER GLORY V.024S",
    etd: "2024-06-05",
    eta: "2024-06-18",
    bl_no: "BUSPKL10293847",
  },
  trade_terms: {
    incoterms: "FOB BUSAN",
    payment_terms: "T/T 30% ADVANCE, 70% AGAINST B/L COPY",
    currency: "USD",
  },
  line_items: [
    { line_no: 1, hs_code: "3304.99.1000", description: "Facial Toner (Hydrating) 200ml", country_of_origin: "REPUBLIC OF KOREA", quantity: 500, unit: "PCS", unit_price: "12.50", amount: "6250.00" },
    { line_no: 2, hs_code: "3304.99.2000", description: "Moisturizing Cream (Ceramide) 50g", country_of_origin: "REPUBLIC OF KOREA", quantity: 300, unit: "PCS", unit_price: "24.00", amount: "7200.00" },
    { line_no: 3, hs_code: "3304.10.0000", description: "Lip Tint (Long-lasting) 5g", country_of_origin: "REPUBLIC OF KOREA", quantity: 1000, unit: "PCS", unit_price: "8.20", amount: "8200.00" },
    { line_no: 4, hs_code: "3305.90.0000", description: "Hair Serum (Repair) 100ml", country_of_origin: "REPUBLIC OF KOREA", quantity: 200, unit: "PCS", unit_price: "15.00", amount: "3000.00" },
  ],
  totals: {
    subtotal: "24650.00",
    freight: "0.00",
    insurance: "0.00",
    additional_charges: [{ description: "Packing Fee", amount: "150.00" }],
    discount: "0.00",
    total_amount: "24800.00",
    amount_in_words: "SAY US DOLLARS TWENTY FOUR THOUSAND EIGHT HUNDRED ONLY",
  },
  packages: {
    total_packages: 45,
    package_type: "CARTONS",
    gross_weight_kg: "540.50",
    net_weight_kg: "510.00",
    measurement_cbm: "2.85",
  },
  declarations: {
    signatory: "Minsu Kim / General Manager",
    signature_date: new Date().toISOString().split('T')[0],
    statement: "WE HEREBY CERTIFY THAT THE ABOVE MENTIONED GOODS ARE OF KOREAN ORIGIN AND THE INVOICE IS TRUE AND CORRECT.",
  },
  bank_details: {
    bank_name: "SHINHAN BANK",
    branch: "HEAD OFFICE, SEOUL",
    swift_code: "SHBKKRSE",
    account_no: "110-123-456789",
    account_holder: "AMORE BEAUTY CO., LTD.",
  },
};

const demoPackingListBase: PackingList = {
  packing_list_no: "PL-2026-KR-00142",
  date: new Date().toISOString().split('T')[0],
  invoice_ref: "CI-2026-KR-00142",
  shipper: demoInvoiceBase.shipper,
  consignee: demoInvoiceBase.consignee,
  shipment_details: demoInvoiceBase.shipment_details,
  items: [
    { line_no: 1, description: "Facial Toner (Hydrating) 200ml", quantity: 500, unit: "PCS", net_weight_kg: "100.00", gross_weight_kg: "110.00", measurement_cbm: "0.60", carton_no: "1-10" },
    { line_no: 2, description: "Moisturizing Cream (Ceramide) 50g", quantity: 300, unit: "PCS", net_weight_kg: "60.00", gross_weight_kg: "68.00", measurement_cbm: "0.40", carton_no: "11-18" },
    { line_no: 3, description: "Lip Tint (Long-lasting) 5g", quantity: 1000, unit: "PCS", net_weight_kg: "25.00", gross_weight_kg: "32.00", measurement_cbm: "0.25", carton_no: "19-25" },
    { line_no: 4, description: "Hair Serum (Repair) 100ml", quantity: 200, unit: "PCS", net_weight_kg: "100.00", gross_weight_kg: "102.50", measurement_cbm: "0.60", carton_no: "26-45" },
  ],
  totals: {
    total_cartons: 45,
    total_net_weight_kg: "285.00",
    total_gross_weight_kg: "312.50",
    total_measurement_cbm: "1.85",
  },
  declarations: {
    signatory: "Minsu Kim / General Manager",
    signature_date: new Date().toISOString().split('T')[0],
  }
};

const demoSalesContractBase: SalesContract = {
  contract_no: "SC-2026-KR-00089",
  date: new Date().toISOString().split('T')[0],
  seller: demoInvoiceBase.shipper,
  buyer: demoInvoiceBase.consignee,
  trade_terms: demoInvoiceBase.trade_terms,
  items: [
    { line_no: 1, description: "Facial Toner (Hydrating) 200ml", hs_code: "3304.99.1000", quantity: 500, unit: "PCS", unit_price: "12.50", amount: "6250.00" },
    { line_no: 2, description: "Moisturizing Cream (Ceramide) 50g", hs_code: "3304.99.2000", quantity: 300, unit: "PCS", unit_price: "24.00", amount: "7200.00" },
    { line_no: 3, description: "Lip Tint (Long-lasting) 5g", hs_code: "3304.10.0000", quantity: 1000, unit: "PCS", unit_price: "8.20", amount: "8200.00" },
    { line_no: 4, description: "Hair Serum (Repair) 100ml", hs_code: "3305.90.0000", quantity: 200, unit: "PCS", unit_price: "15.00", amount: "3000.00" },
  ],
  total_amount: "24650.00",
  payment_terms: "T/T 30% advance, 70% against B/L copy",
  delivery_date: "Within 30 days after contract signing",
  validity_period: "90 days from the date of this contract",
  quality_standard: "Products shall conform to Korean FDA standards",
  penalty_clause: "Late delivery penalty: 0.5% of contract value per week, max 5%",
  arbitration: "Any dispute shall be settled by KCIA (Korean Commercial Arbitration Institute) in Seoul",
  signatures: {
    seller_signatory: "Minsu Kim",
    buyer_signatory: "John Doe",
    date: new Date().toISOString().split('T')[0],
  }
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      document_type = "commercial_invoice",
      shipperInfo, 
      consigneeInfo, 
      items, 
      currency = "USD", 
      incoterms, 
      paymentTerms,
      freight = "0.00",
      insurance = "0.00",
      additionalCharges = [],
      discount = "0.00",
      contractTerms
    } = body;

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      let customizedDemo;
      if (document_type === "packing_list") {
        customizedDemo = JSON.parse(JSON.stringify(demoPackingListBase));
        if (shipperInfo?.company_name) customizedDemo.shipper.company_name = shipperInfo.company_name;
        if (consigneeInfo?.company_name) customizedDemo.consignee.company_name = consigneeInfo.company_name;
        if (items && items.length > 0) {
          customizedDemo.items = items.map((item: any, idx: number) => ({
            line_no: idx + 1,
            description: item.description,
            quantity: Number(item.quantity) || 0,
            unit: item.unit || "PCS",
            net_weight_kg: item.net_weight_kg || "0.00",
            gross_weight_kg: item.gross_weight_kg || "0.00",
            measurement_cbm: item.measurement_cbm || "0.00",
            carton_no: item.carton_no || `${idx + 1}`
          }));
          // Re-calculate totals roughly for demo
          customizedDemo.totals.total_cartons = items.length * 10; // dummy
        }
      } else if (document_type === "sales_contract") {
        customizedDemo = JSON.parse(JSON.stringify(demoSalesContractBase));
        if (shipperInfo?.company_name) customizedDemo.seller.company_name = shipperInfo.company_name;
        if (consigneeInfo?.company_name) customizedDemo.buyer.company_name = consigneeInfo.company_name;
        if (contractTerms) {
          customizedDemo = { ...customizedDemo, ...contractTerms };
        }
        if (items && items.length > 0) {
          customizedDemo.items = items.map((item: any, idx: number) => ({
            line_no: idx + 1,
            hs_code: item.hs_code || "0000.00",
            description: item.description,
            quantity: Number(item.quantity) || 0,
            unit: item.unit || "PCS",
            unit_price: item.unit_price || "0.00",
            amount: calculateLineAmount(Number(item.quantity), item.unit_price)
          }));
          customizedDemo.total_amount = customizedDemo.items.reduce((acc: number, item: any) => acc + parseFloat(item.amount), 0).toFixed(2);
        }
      } else {
        // Commercial Invoice
        customizedDemo = JSON.parse(JSON.stringify(demoInvoiceBase));
        if (shipperInfo?.company_name) customizedDemo.shipper.company_name = shipperInfo.company_name;
        if (consigneeInfo?.company_name) customizedDemo.consignee.company_name = consigneeInfo.company_name;
        customizedDemo.trade_terms.currency = currency;
        if (incoterms) customizedDemo.trade_terms.incoterms = incoterms;
        if (paymentTerms) customizedDemo.trade_terms.payment_terms = paymentTerms;

        if (items && items.length > 0) {
          customizedDemo.line_items = items.map((item: any, idx: number) => ({
            line_no: idx + 1,
            hs_code: item.hs_code || "0000.00",
            description: item.description,
            country_of_origin: item.country_of_origin || "REPUBLIC OF KOREA",
            quantity: Number(item.quantity) || 0,
            unit: item.unit || "PCS",
            unit_price: item.unit_price || "0.00",
            amount: calculateLineAmount(Number(item.quantity), item.unit_price)
          }));
        }

        const totals = calculateTotals(
          customizedDemo.line_items,
          freight,
          insurance,
          additionalCharges,
          discount
        );
        
        customizedDemo.totals = {
          ...totals,
          amount_in_words: numberToWords(totals.total_amount, currency)
        };
      }

      return NextResponse.json({ ...customizedDemo, isDemoMode: true });
    }

    // OpenAI Implementation
    let interfaceName = "CommercialInvoice";
    if (document_type === "packing_list") interfaceName = "PackingList";
    if (document_type === "sales_contract") interfaceName = "SalesContract";

    const prompt = `Generate a professional ${document_type} JSON based on these details:
    Document Type: ${document_type}
    Currency: ${currency}
    Exporter/Seller: ${JSON.stringify(shipperInfo)}
    Importer/Buyer: ${JSON.stringify(consigneeInfo)}
    Items: ${JSON.stringify(items)}
    Trade Terms: ${incoterms}, ${paymentTerms}
    Contract Specifics: ${JSON.stringify(contractTerms)}
    
    The response must match the TypeScript interface "${interfaceName}" precisely.
    Use current date. Invent realistic addresses, contact info, and HS codes if missing.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
    });

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);
    return NextResponse.json(result);

  } catch (error) {
    console.error("Document generation error:", error);
    return NextResponse.json({ error: "Failed to generate document" }, { status: 500 });
  }
}
