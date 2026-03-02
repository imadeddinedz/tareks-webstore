import { supabaseAdmin } from './supabase';

const YALIDINE_BASE_URL = 'https://api.yalidine.app/v1/';

export interface YalidineParcelParams {
    order_id: string;
    firstname: string;
    familyname: string;
    contact_phone: string;
    address: string;
    to_commune_name: string;
    to_wilaya_name: string;
    product_list: string;
    price: number;
    freeshipping: boolean;
    is_stopdesk: boolean;
    has_exchange: boolean;
    product_to_collect?: string;
}

async function getYalidineCredentials() {
    if (!supabaseAdmin) throw new Error("Supabase Admin client not configured.");

    // Fetch directly from database using admin bypass
    const { data, error } = await supabaseAdmin.from('store_settings').select('*').single();
    if (error || !data) throw new Error("Could not load Yalidine credentials from settings.");

    return {
        apiId: data.yalidine_api_id,
        apiToken: data.yalidine_api_token
    };
}

export async function createYalidineParcel(parcel: YalidineParcelParams) {
    const creds = await getYalidineCredentials();

    if (!creds.apiId || !creds.apiToken) {
        throw new Error("Yalidine API credentials missing in settings.");
    }

    const response = await fetch(`${YALIDINE_BASE_URL}parcels/`, {
        method: 'POST',
        headers: {
            'X-API-ID': creds.apiId,
            'X-API-TOKEN': creds.apiToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify([parcel]) // Yalidine expects an array of parcels
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error?.message || "Failed to create parcel in Yalidine");
    }

    return data;
}

export async function getYalidineDeliveryFees(wilaya_id: number) {
    const creds = await getYalidineCredentials();

    if (!creds.apiId || !creds.apiToken) {
        throw new Error("Yalidine API credentials missing in settings.");
    }

    const response = await fetch(`${YALIDINE_BASE_URL}deliveryfees/?wilaya_id=${wilaya_id}`, {
        method: 'GET',
        headers: {
            'X-API-ID': creds.apiId,
            'X-API-TOKEN': creds.apiToken,
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error("Failed to fetch delivery fees from Yalidine");
    }

    return data;
}

export async function getYalidineTracking(trackingNumber: string) {
    const creds = await getYalidineCredentials();

    if (!creds.apiId || !creds.apiToken) {
        throw new Error("Yalidine API credentials missing in settings.");
    }

    const response = await fetch(`${YALIDINE_BASE_URL}histories/?tracking=${trackingNumber}`, {
        method: 'GET',
        headers: {
            'X-API-ID': creds.apiId,
            'X-API-TOKEN': creds.apiToken,
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error("Failed to fetch tracking history from Yalidine");
    }

    return data;
}
