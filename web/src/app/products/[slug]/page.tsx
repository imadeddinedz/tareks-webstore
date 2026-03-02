import { getProductBySlug, getRelatedProducts, formatPrice } from '@/lib/products';
import { notFound } from 'next/navigation';
import { ProductDetail } from '@/components/ProductDetail';
import { ProductCard } from '@/components/ProductCard';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Produit introuvable' };
  return {
    title: `${product.name} | High Tech Sport`,
    description: product.description || `Achetez ${product.name} chez High Tech Sport. Livraison vers les 58 wilayas.`,
    openGraph: {
      title: product.name,
      description: product.description || '',
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.category_id, product.id);

  return (
    <div className="page-enter" style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px 80px' }}>
      <ProductDetail product={product} />

      {related.length > 0 && (
        <section style={{ marginTop: 60 }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700, marginBottom: 24 }}>
            Produits similaires
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 20,
            }}
          >
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
