import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    if (!supabase) return NextResponse.json([]);

    const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug, image, description, sort_order')
        .eq('is_visible', true)
        .order('sort_order', { ascending: true });

    if (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json([]);
    }

    return NextResponse.json(data || []);
}
