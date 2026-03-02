import { supabase } from './supabase';

export interface Wilaya {
  code: number;
  name: string;
  deskPrice: number;
  homePrice: number;
  estimatedDays: number;
}

export const WILAYAS: Wilaya[] = [
  { code: 1, name: 'Adrar', deskPrice: 800, homePrice: 1000, estimatedDays: 5 },
  { code: 2, name: 'Chlef', deskPrice: 500, homePrice: 700, estimatedDays: 2 },
  { code: 3, name: 'Laghouat', deskPrice: 700, homePrice: 900, estimatedDays: 4 },
  { code: 4, name: 'Oum El Bouaghi', deskPrice: 600, homePrice: 800, estimatedDays: 3 },
  { code: 5, name: 'Batna', deskPrice: 600, homePrice: 800, estimatedDays: 3 },
  { code: 6, name: 'Béjaïa', deskPrice: 500, homePrice: 700, estimatedDays: 2 },
  { code: 7, name: 'Biskra', deskPrice: 600, homePrice: 800, estimatedDays: 3 },
  { code: 8, name: 'Béchar', deskPrice: 800, homePrice: 1000, estimatedDays: 5 },
  { code: 9, name: 'Blida', deskPrice: 400, homePrice: 600, estimatedDays: 1 },
  { code: 10, name: 'Bouira', deskPrice: 500, homePrice: 700, estimatedDays: 2 },
  { code: 11, name: 'Tamanrasset', deskPrice: 900, homePrice: 1100, estimatedDays: 6 },
  { code: 12, name: 'Tébessa', deskPrice: 600, homePrice: 800, estimatedDays: 3 },
  { code: 13, name: 'Tlemcen', deskPrice: 600, homePrice: 800, estimatedDays: 3 },
  { code: 14, name: 'Tiaret', deskPrice: 500, homePrice: 700, estimatedDays: 2 },
  { code: 15, name: 'Tizi Ouzou', deskPrice: 500, homePrice: 700, estimatedDays: 2 },
  { code: 16, name: 'Alger', deskPrice: 400, homePrice: 600, estimatedDays: 1 },
  { code: 17, name: 'Djelfa', deskPrice: 600, homePrice: 800, estimatedDays: 3 },
  { code: 18, name: 'Jijel', deskPrice: 500, homePrice: 700, estimatedDays: 2 },
  { code: 19, name: 'Sétif', deskPrice: 500, homePrice: 700, estimatedDays: 2 },
  { code: 20, name: 'Saïda', deskPrice: 600, homePrice: 800, estimatedDays: 3 },
  { code: 21, name: 'Skikda', deskPrice: 500, homePrice: 700, estimatedDays: 2 },
  { code: 22, name: 'Sidi Bel Abbès', deskPrice: 600, homePrice: 800, estimatedDays: 3 },
  { code: 23, name: 'Annaba', deskPrice: 500, homePrice: 700, estimatedDays: 2 },
  { code: 24, name: 'Guelma', deskPrice: 600, homePrice: 800, estimatedDays: 3 },
  { code: 25, name: 'Constantine', deskPrice: 500, homePrice: 700, estimatedDays: 2 },
  { code: 26, name: 'Médéa', deskPrice: 400, homePrice: 600, estimatedDays: 1 },
  { code: 27, name: 'Mostaganem', deskPrice: 500, homePrice: 700, estimatedDays: 2 },
  { code: 28, name: "M'sila", deskPrice: 600, homePrice: 800, estimatedDays: 3 },
  { code: 29, name: 'Mascara', deskPrice: 600, homePrice: 800, estimatedDays: 3 },
  { code: 30, name: 'Ouargla', deskPrice: 700, homePrice: 900, estimatedDays: 4 },
  { code: 31, name: 'Oran', deskPrice: 500, homePrice: 700, estimatedDays: 2 },
  { code: 32, name: 'El Bayadh', deskPrice: 700, homePrice: 900, estimatedDays: 4 },
  { code: 33, name: 'Illizi', deskPrice: 900, homePrice: 1100, estimatedDays: 6 },
  { code: 34, name: 'Bordj Bou Arréridj', deskPrice: 500, homePrice: 700, estimatedDays: 2 },
  { code: 35, name: 'Boumerdès', deskPrice: 400, homePrice: 600, estimatedDays: 1 },
  { code: 36, name: 'El Tarf', deskPrice: 600, homePrice: 800, estimatedDays: 3 },
  { code: 37, name: 'Tindouf', deskPrice: 900, homePrice: 1100, estimatedDays: 6 },
  { code: 38, name: 'Tissemsilt', deskPrice: 600, homePrice: 800, estimatedDays: 3 },
  { code: 39, name: 'El Oued', deskPrice: 700, homePrice: 900, estimatedDays: 4 },
  { code: 40, name: 'Khenchela', deskPrice: 600, homePrice: 800, estimatedDays: 3 },
  { code: 41, name: 'Souk Ahras', deskPrice: 600, homePrice: 800, estimatedDays: 3 },
  { code: 42, name: 'Tipaza', deskPrice: 400, homePrice: 600, estimatedDays: 1 },
  { code: 43, name: 'Mila', deskPrice: 500, homePrice: 700, estimatedDays: 2 },
  { code: 44, name: 'Aïn Defla', deskPrice: 400, homePrice: 600, estimatedDays: 1 },
  { code: 45, name: 'Naâma', deskPrice: 700, homePrice: 900, estimatedDays: 4 },
  { code: 46, name: 'Aïn Témouchent', deskPrice: 600, homePrice: 800, estimatedDays: 3 },
  { code: 47, name: 'Ghardaïa', deskPrice: 700, homePrice: 900, estimatedDays: 4 },
  { code: 48, name: 'Relizane', deskPrice: 500, homePrice: 700, estimatedDays: 2 },
  { code: 49, name: "El M'hir", deskPrice: 600, homePrice: 800, estimatedDays: 3 },
  { code: 50, name: 'El Meniaa', deskPrice: 800, homePrice: 1000, estimatedDays: 5 },
  { code: 51, name: 'Ouled Djellal', deskPrice: 700, homePrice: 900, estimatedDays: 4 },
  { code: 52, name: 'Bordj Badji Mokhtar', deskPrice: 900, homePrice: 1100, estimatedDays: 6 },
  { code: 53, name: 'Béni Abbès', deskPrice: 800, homePrice: 1000, estimatedDays: 5 },
  { code: 54, name: 'Timimoun', deskPrice: 900, homePrice: 1100, estimatedDays: 6 },
  { code: 55, name: 'Touggourt', deskPrice: 700, homePrice: 900, estimatedDays: 4 },
  { code: 56, name: 'Djanet', deskPrice: 900, homePrice: 1100, estimatedDays: 6 },
  { code: 57, name: 'In Salah', deskPrice: 900, homePrice: 1100, estimatedDays: 6 },
  { code: 58, name: 'In Guezzam', deskPrice: 900, homePrice: 1100, estimatedDays: 6 },
];

export function getWilayaByCode(code: number): Wilaya | undefined {
  return WILAYAS.find((w) => w.code === code);
}

export function getShippingCost(wilayaCode: number, type: 'desk' | 'home' = 'home'): number {
  const wilaya = getWilayaByCode(wilayaCode);
  if (!wilaya) return 800;
  return type === 'desk' ? wilaya.deskPrice : wilaya.homePrice;
}

export async function getWilayas(): Promise<Wilaya[]> {
  if (!supabase) return WILAYAS;
  const { data, error } = await supabase
    .from('shipping_rates')
    .select('*')
    .eq('is_active', true)
    .order('wilaya_code');

  if (error || !data || data.length === 0) {
    console.warn('Error fetching shipping rates or empty falling back to static WILAYAS', error);
    return WILAYAS;
  }

  return data.map((row: any) => ({
    code: row.wilaya_code,
    name: row.wilaya_name,
    deskPrice: row.desk_price,
    homePrice: row.home_price,
    estimatedDays: row.estimated_days,
  }));
}
