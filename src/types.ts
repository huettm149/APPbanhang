export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

export interface ICartItem extends Product {
  quantity: number;
}

export type ViewMode = "cart" | "settings" | "login" | "catalog" | "about";

export interface CompanySection {
  label: string;
  value: string;
}

export interface CompanyInfo {
  title: string;
  image?: string;
  sections: CompanySection[];
}

export interface AppConfig {
  imageFolderLink: string;
  excelFileLink: string;
}

export interface CustomerInfo {
  fullName: string;
  phone: string;
  address: string;
  note?: string;
}

export interface DiscountCode {
  code: string;
  percent?: number;
  amount?: number;
}

export interface TaxConfig {
  name: string;
  rate: number;
}

export interface Order {
  id: string;
  items: ICartItem[];
  customer: CustomerInfo;
  subtotal: number;
  taxAmount: number;
  shippingFee: number;
  discountAmount: number;
  discountCode?: string;
  finalTotal: number;
  status: "pending" | "completed";
  timestamp: string;
}

