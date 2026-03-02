import { redirect, notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { getProductBySlug } from '@/lib/products';
import { ProductForm } from '@/components/ProductForm';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { slug } = await params;
  const cookieStore = await cookies();
  if (cookieStore.get('hts_admin')?.value !== '1') redirect('/admin');

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) redirect('/admin/products');

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  if (product.id.startsWith('sample-')) {
    redirect('/admin/products');
  }

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto min-h-screen">
      <Link href="/admin/products" className="mb-6 inline-flex items-center gap-2 text-[#F59E0B] font-medium hover:text-[#D97706] transition-colors">
        ← Retour aux produits
      </Link>
      <h1 className="mb-8 font-heading font-black text-3xl md:text-4xl text-gray-900 tracking-tight">Modifier le produit</h1>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
        <ProductForm product={product} />
      </div>
    </div>
  );
}
