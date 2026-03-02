export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface ProductVariant {
  name: string;
  type: 'color' | 'size';
  options: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  old_price?: number | null;
  sku?: string;
  stock: number;
  category_id: string | null;
  images: string[];
  variants?: ProductVariant[];
  tags?: string[];
  status: 'published' | 'draft' | 'hidden';
  is_featured?: boolean;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  category?: Category;
}
