import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1440/api';

export async function GET(
    request: Request, // It's conventional to use the standard Request type
    { params }: { params: { id: string } }
) {
    try {
        const backendUrl = `${BACKEND_URL}/athletes/${params.id}`;

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

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const backendUrl = `${BACKEND_URL}/athletes/${params.id}`;

        console.log('Proxying PUT request to:', backendUrl, 'with body:', body);

        const response = await fetch(backendUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('Error proxying PUT request:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const backendUrl = `${BACKEND_URL}/athletes/${params.id}`;

        console.log('Proxying DELETE request to:', backendUrl);

        const response = await fetch(backendUrl, {
            method: 'DELETE',
        });

        // DELETE requests often return no body, or a non-JSON body on success.
        // It's safer to check the status and return a specific success message.
        if (response.ok) {
            return NextResponse.json({ message: 'Delete successful' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('Error proxying DELETE request:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}