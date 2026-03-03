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
    <div className="page-enter min-h-screen bg-[var(--bg)] pb-24 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-heading text-3xl md:text-4xl font-black text-[var(--text)]">
            {currentCategory ? currentCategory.name : 'Tous les produits'}
          </h1>
          <p className="text-[var(--text-secondary)] mt-2 text-lg">
            {currentCategory
              ? currentCategory.description
              : 'Découvrez notre sélection de montres connectées, vélos et accessoires'}
          </p>
        </div>

        {/* Category filters */}
        <div className="flex gap-3 mb-10 overflow-x-auto pb-4 scrollbar-hide py-1 px-1">
          <Link
            href="/products"
            className={!categorySlug
              ? "px-5 py-2 rounded-xl text-sm font-bold bg-[var(--brand)] text-[#08080F] shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all"
              : "px-5 py-2 rounded-xl text-sm font-medium glass border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text)] hover:border-[var(--brand)] transition-all"}
          >
            Tous
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className={categorySlug === cat.slug
                ? "px-5 py-2 rounded-xl text-sm font-bold bg-[var(--brand)] text-[#08080F] shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all"
                : "px-5 py-2 rounded-xl text-sm font-medium glass border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text)] hover:border-[var(--brand)] transition-all"}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Products grid */}
        {products.length === 0 ? (
          <div className="text-center py-20 px-4 text-[var(--text-muted)] glass rounded-3xl border border-[var(--border)]">
            <p className="text-5xl mb-4">🔍</p>
            <p className="font-heading font-semibold text-xl text-[var(--text)]">
              Aucun produit trouvé
            </p>
            <p className="mt-2 text-[var(--text-secondary)]">
              Essayez une autre catégorie ou revenez bientôt pour de nouveaux arrivages
            </p>
          </div>
        ) : (
          <>
            <p className="text-[var(--text-muted)] mb-6 text-sm">
              {products.length} produit{products.length > 1 ? 's' : ''} trouvé{products.length > 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
