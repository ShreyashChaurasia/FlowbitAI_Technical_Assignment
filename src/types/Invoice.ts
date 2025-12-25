export interface LineItem {
  sku?: string | null;
  description?: string;
  qty: number;
  unitPrice: number;
}

export interface Invoice {
  invoiceId: string;
  vendor: string;
  fields: Record<string, any>;
  confidence: number;
  rawText: string;
}
