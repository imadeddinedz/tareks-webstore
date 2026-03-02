import { supabase } from './supabase';
import type { Product, Category } from './data';

export async function getProducts(categorySlug?: string, includeHidden = false): Promise<Product[]> {
  if (!supabase) return [];

  let query = supabase
    .from('products')
    .select('*, category:categories(*)')
    .order('created_at', { ascending: false });

  if (!includeHidden) {
    query = query.eq('status', 'published');
  }

  if (categorySlug) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single();
    if (cat) query = query.eq('category_id', cat.id);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return (data as Product[]) || [];
}

export async function getFeaturedProducts(): Promise<Product[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(6);

  if (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
  return (data as Product[]) || [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
  return data as Product;
}

export async function getCategories(): Promise<Category[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('position');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  return (data as Category[]) || [];
}

export async function getRelatedProducts(
  categoryId: string | null,
  currentId: string,
  limit = 4
): Promise<Product[]> {
  if (!supabase || !categoryId) return [];
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('category_id', categoryId)
    .eq('status', 'published')
    .neq('id', currentId)
    .limit(limit);

  if (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
  return (data as Product[]) || [];
}

export async function deleteProduct(productId: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);
  if (error) {
    console.error('Error deleting product:', error);
    return false;
  }
  return true;
}

export function formatPrice(price: number): string {
  if (price === 0) return '0 DA';
  return (
    new Intl.NumberFormat('fr-DZ', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(price) + ' DA'
  );
}
