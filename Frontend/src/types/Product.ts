export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  vat: number;
  tag_name: string | null;
  tag_color: string | null;
  sort_order?: number;
  image_url: string | null;
  is_featured?: boolean;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  vat: number;
  tag_name: string;
  tag_color: string;
} 