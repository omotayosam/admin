import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1440/api';

export async function GET(
    request: NextRequest,
    { params }: { params: { code: string } }
) {
    try {
        const backendUrl = `${BACKEND_URL}/athletes/code/${params.code}`;

        console.log('Proxying GET request to:', backendUrl);

        const response = await fetch(backendUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('Error proxying GET request:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 