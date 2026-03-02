import { supabase } from './supabase';
import type { Product, Category } from './data';

async function applyPromotions(products: Product[]): Promise<Product[]> {
  if (!supabase || products.length === 0) return products;

  const { data: promos } = await supabase
    .from('promotions')
    .select('*, promotion_products(product_id)')
    .eq('is_active', true);

  if (!promos || promos.length === 0) return products;

  const validPromos = promos.filter(p => {
    const startValid = !p.starts_at || new Date(p.starts_at) <= new Date();
    const endValid = !p.ends_at || new Date(p.ends_at) >= new Date();
    return startValid && endValid && p.type !== 'free_shipping';
  });

  if (validPromos.length === 0) return products;

  return products.map(product => {
    let bestPrice = product.price;
    let applied = false;

    for (const promo of validPromos) {
      let applies = false;
      if (promo.applies_to === 'all') applies = true;
      if (promo.applies_to === 'specific_products') {
        if (promo.promotion_products?.some((pp: any) => pp.product_id === product.id)) applies = true;
      }

      if (applies) {
        let discountedPrice = product.price;
        if (promo.type === 'percentage') {
          discountedPrice = product.price * (1 - promo.value / 100);
        } else if (promo.type === 'fixed') {
          discountedPrice = product.price - promo.value;
        }

        if (discountedPrice < bestPrice && discountedPrice > 0) {
          bestPrice = discountedPrice;
          applied = true;
        }
      }
    }

    if (applied && bestPrice < product.price) {
      return {
        ...product,
        old_price: product.old_price || product.price, // Preserve existing old price if any
        price: Math.round(bestPrice),
      };
    }
    return product;
  });
}

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
  return applyPromotions((data as Product[]) || []);
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
  return applyPromotions((data as Product[]) || []);
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
  const products = await applyPromotions([data as Product]);
  return products[0] || null;
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
  return applyPromotions((data as Product[]) || []);
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
