export interface PartyInfo {
  company_name: string;
  address: string;
  tel: string;
  email: string;
  tax_id?: string;              // Business Registration No / EORI / VAT No
  registration_no?: string;     // Additional identification
}

export interface ShipmentDetails {
  place_of_receipt: string;     // Receipt point (Port, Terminal, Border)
  port_of_loading: string;
  port_of_discharge: string;
  place_of_delivery: string;    // Final destination
  vessel_or_vehicle: string;    // Vessel / Flight / Vehicle (Multimodal)
  etd: string;
  eta: string;
  bl_no?: string;
  awb_no?: string;              // Air Waybill
}

export interface LineItem {
  line_no: number;
  hs_code: string;
  description: string;          // Can be long for L/C transactions
  country_of_origin: string;
  quantity: number;
  unit: string;
  unit_price: string;           // String to prevent floating point issues ("12.50")
  amount: string;               // String to prevent floating point issues ("6250.00")
}

export interface AdditionalCharge {
  description: string;          // "Packing Fee", "Bank Handling Charge", etc.
  amount: string;
}

export interface InvoiceTotals {
  subtotal: string;
  freight: string;
  insurance: string;
  additional_charges: AdditionalCharge[];
  discount: string;             // Discount amount
  total_amount: string;
  amount_in_words: string;
}

export interface TradeTerms {
  incoterms: string;
  payment_terms: string;
  currency: string;             // "USD", "EUR", "JPY", "KRW", "CNY", etc.
}

export interface CommercialInvoice {
  invoice_no: string;
  date: string;
  shipper: PartyInfo;
  consignee: PartyInfo;         // includes tax_id (EORI, VAT, etc.)
  notify_party: {
    company_name: string;
    note: string;
  };
  shipment_details: ShipmentDetails;
  trade_terms: TradeTerms;
  line_items: LineItem[];
  totals: InvoiceTotals;
  packages: {
    total_packages: number;
    package_type: string;
    gross_weight_kg: string;
    net_weight_kg: string;
    measurement_cbm: string;
  };
  declarations: {
    signatory: string;
    signature_date: string;
    statement: string;
  };
  bank_details: {
    bank_name: string;
    branch: string;
    swift_code: string;
    account_no: string;
    account_holder: string;
  };
}

export interface PackingListItem {
  line_no: number;
  description: string;
  quantity: number;
  unit: string;
  net_weight_kg: string;
  gross_weight_kg: string;
  measurement_cbm: string;
  carton_no: string;
}

export interface PackingList {
  packing_list_no: string;
  date: string;
  invoice_ref: string;
  shipper: PartyInfo;
  consignee: PartyInfo;
  shipment_details: ShipmentDetails;
  items: PackingListItem[];
  totals: {
    total_cartons: number;
    total_net_weight_kg: string;
    total_gross_weight_kg: string;
    total_measurement_cbm: string;
  };
  declarations: {
    signatory: string;
    signature_date: string;
  };
}

export interface SalesContract {
  contract_no: string;
  date: string;
  seller: PartyInfo;
  buyer: PartyInfo;
  trade_terms: TradeTerms;
  items: Array<{
    line_no: number;
    description: string;
    hs_code: string;
    quantity: number;
    unit: string;
    unit_price: string;
    amount: string;
  }>;
  total_amount: string;
  payment_terms: string;
  delivery_date: string;
  validity_period: string;
  quality_standard: string;
  penalty_clause: string;
  arbitration: string;
  signatures: {
    seller_signatory: string;
    buyer_signatory: string;
    date: string;
  };
}

export type DocumentType = "commercial_invoice" | "packing_list" | "sales_contract";
