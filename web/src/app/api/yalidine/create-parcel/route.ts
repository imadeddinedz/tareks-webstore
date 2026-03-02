import { NextResponse } from 'next/server';
import { createYalidineParcel } from '@/lib/yalidine';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = await createYalidineParcel(body);

        // Result is typically an array or object containing tracking details
        // Assuming Yalidine returns an array of parcel results when passing an array
        // We'll extract the tracking ID if successful
        const parcelData = Array.isArray(result) ? result[0] : (result[body.order_id] || result);

        return NextResponse.json({ success: true, data: parcelData });
    } catch (error: any) {
        console.error("Yalidine API Error:", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
