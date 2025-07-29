import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Employee from '@/models/employees';

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS', // Added PUT
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, department, position } = body;

        if (!name || !email) {
            return new NextResponse(JSON.stringify({ message: 'Name and Email are required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
        }

        await connectToDatabase();

        const newEmployee = await Employee.create({ name, email, department, position });

        return new NextResponse(
            JSON.stringify({ message: 'Employee added successfully!', employee: newEmployee }), 
            {
                status: 201,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            }
        );
    } catch (error: any) {
        console.error("Error creating employee:", error);
        if (error.code === 11000) { 
            return new NextResponse(JSON.stringify({ message: 'Employee with this email already exists', error: error.message }), {
                status: 409, 
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            });
        }
        return new NextResponse(JSON.stringify({ message: 'Error adding employee', error: error.message }), { 
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    }
}

export async function GET() {
    try {
        await connectToDatabase();
        const employees = await Employee.find().sort({ _id: -1 }); 
        return new NextResponse(JSON.stringify({ employees }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch (error: any) {
        console.error("Error fetching employees:", error);
        return new NextResponse(JSON.stringify({ message: 'Error fetching employees', error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    }
}