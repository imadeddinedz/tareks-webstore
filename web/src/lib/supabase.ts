import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

export const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(supabaseUrl!, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null;

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_wilaya: string;
  customer_commune: string;
  customer_address: string;
  delivery_notes: string;
  items: any;
  subtotal: number;
  shipping_cost: number;
  discount: number;
  total: number;
  promo_code: string;
  status: 'new' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  internal_notes: string;
  created_at: string;
  updated_at: string;
}

export async function getOrders(): Promise<Order[]> {
  const client = supabaseAdmin || supabase;
  if (!client) return [];

  const { data, error } = await client
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
  return data as Order[];
}

export async function updateOrderStatus(orderId: string, newStatus: string): Promise<boolean> {
  const client = supabaseAdmin || supabase;
  if (!client) return false;

  const { error } = await client
    .from('orders')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', orderId);

  if (error) {
    console.error('Error updating order status:', error);
    return false;
  }
  return true;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  wilaya: string;
  commune: string;
  address: string;
  order_count: number;
  total_spent: number;
  is_blacklisted: boolean;
  blacklist_reason: string | null;
  created_at: string;
  updated_at: string;
}

export async function getCustomers(): Promise<Customer[]> {
  const client = supabaseAdmin || supabase;
  if (!client) return [];

  const { data, error } = await client
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
  return data as Customer[];
}

export async function updateCustomerBlacklist(customerId: string, isBlacklisted: boolean): Promise<boolean> {
  const client = supabaseAdmin || supabase;
  if (!client) return false;

  const { error } = await client
    .from('customers')
    .update({ is_blacklisted: isBlacklisted, updated_at: new Date().toISOString() })
    .eq('id', customerId);

  if (error) {
    console.error('Error updating customer blacklist:', error);
    return false;
  }
  return true;
}

export interface Promotion {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_order: number;
  max_uses: number | null;
  used_count: number;
  is_active: boolean;
  ends_at: string;
}

export async function getPromotions(): Promise<Promotion[]> {
  const client = supabaseAdmin || supabase;
  if (!client) return [];

  const { data, error } = await client
    .from('promotions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    // If table doesn't exist yet, we silently return empty array
    return [];
  }
  return data as Promotion[];
}
