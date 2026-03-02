import { getProducts, getCategories } from '@/lib/products';
import { ProductCard } from '@/components/ProductCard';
import Link from 'next/link';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const categorySlug = params.category;
  const products = await getProducts(categorySlug);
  const categories = await getCategories();
  const currentCategory = categories.find((c) => c.slug === categorySlug);

  return (
    <div className="page-enter" style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px 80px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800 }}>
          {currentCategory ? currentCategory.name : 'Tous les produits'}
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: 8 }}>
          {currentCategory
            ? currentCategory.description
            : 'Découvrez notre sélection de montres connectées, vélos et accessoires'}
        </p>
      </div>

      {/* Category filters */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          marginBottom: 32,
          overflowX: 'auto',
          paddingBottom: 8,
        }}
      >
        <Link
          href="/products"
          className="btn btn-sm"
          style={{
            background: !categorySlug ? 'var(--color-primary)' : 'var(--color-surface)',
            color: !categorySlug ? '#0F0F1A' : 'var(--color-text-secondary)',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            border: '1px solid var(--color-border)',
          }}
        >
          Tous
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className="btn btn-sm"
            style={{
              background: categorySlug === cat.slug ? 'var(--color-primary)' : 'var(--color-surface)',
              color: categorySlug === cat.slug ? '#0F0F1A' : 'var(--color-text-secondary)',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              border: '1px solid var(--color-border)',
            }}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Products grid */}
      {products.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '80px 20px',
            color: 'var(--color-text-muted)',
          }}
        >
          <p style={{ fontSize: '3rem', marginBottom: 16 }}>🔍</p>
          <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '1.1rem' }}>
            Aucun produit trouvé
          </p>
          <p style={{ marginTop: 8, fontSize: '0.9rem' }}>
            Essayez une autre catégorie ou revenez bientôt pour de nouveaux arrivages
          </p>
        </div>
      ) : (
        <>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 20, fontSize: '0.85rem' }}>
            {products.length} produit{products.length > 1 ? 's' : ''} trouvé{products.length > 1 ? 's' : ''}
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 20,
            }}
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
