import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Employee from '@/models/employees';

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}

// GET a single employee by ID
export async function GET(_: Request, { params }: { params: { id: string } }) {
    try {
        await connectToDatabase();
        const employee = await Employee.findById(params.id);

        if (!employee) {
            return new NextResponse(JSON.stringify({ message: 'Employee not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
        }

        return new NextResponse(
            JSON.stringify({ employee }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            }
        );
    } catch (error: any) {
        console.error("Error fetching employee:", error);
        if (error.name === 'CastError') {
             return new NextResponse(
                JSON.stringify({ message: 'Invalid employee ID format', error: error.message }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                }
            );
        }
        return new NextResponse(
            JSON.stringify({ message: 'Error fetching employee', error: error.message }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            }
        );
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectToDatabase();
        const body = await req.json();
        const { name, email, department, position } = body;

        if (!name || !email) {
            return new NextResponse(
                JSON.stringify({ message: 'Name and Email are required for update.' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
                }
            );
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(
            params.id,
            { name, email, department, position },
            { new: true, runValidators: true }
        );

        if (!updatedEmployee) {
            return new NextResponse(JSON.stringify({ message: 'Employee not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
        }

        return new NextResponse(
            JSON.stringify({ message: 'Employee updated successfully!', employee: updatedEmployee }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            }
        );
    } catch (error: any) {
        console.error("Error updating employee:", error);
        if (error.name === 'CastError') {
             return new NextResponse(
                JSON.stringify({ message: 'Invalid employee ID format', error: error.message }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                }
            );
        }
        return new NextResponse(
            JSON.stringify({ message: 'Error updating employee', error: error.message }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            }
        );
    }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
    try {
        await connectToDatabase();
        const result = await Employee.findByIdAndDelete(params.id);

        if (!result) {
            return new NextResponse(JSON.stringify({ message: 'Employee not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
        }

        return new NextResponse(
            JSON.stringify({ message: 'Employee deleted' }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            }
        );
    } catch (error: any) {
        console.error("Error deleting employee:", error);
        if (error.name === 'CastError') {
             return new NextResponse(
                JSON.stringify({ message: 'Invalid employee ID format', error: error.message }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                }
            );
        }
        return new NextResponse(
            JSON.stringify({ message: 'Error deleting employee', error: error.message }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            }
        );
    }
}