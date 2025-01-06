export interface Product {
  id: number;
  title: string;
  slug: string;
  price: number;
  saleAmount: number;
  quantity: number;
  photoPaths: string[];
  bio: string;
  productType: string;
  clothesType?: string;
}
