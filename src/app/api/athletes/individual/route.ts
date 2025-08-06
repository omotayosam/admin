import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1440/api';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const backendUrl = `${BACKEND_URL}/athletes/individual`;

        console.log('Proxying individual athlete POST request to:', backendUrl, 'with body:', body);

        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('Error proxying individual athlete POST request:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 