import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Employee from '@/models/employees';

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}

export async function DELETE(req: Request) {
    try {
        await connectToDatabase();
        const body = await req.json();
        const { ids } = body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return new NextResponse(
                JSON.stringify({ message: 'No employee IDs provided for bulk deletion.' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
                }
            );
        }

        const result = await Employee.deleteMany({ _id: { $in: ids } });

        return new NextResponse(
            JSON.stringify({
                message: `${result.deletedCount} employees deleted successfully!`,
                deletedCount: result.deletedCount
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            }
        );
    } catch (error: any) {
        console.error("Error bulk deleting employees:", error);
        return new NextResponse(
            JSON.stringify({ message: 'Error bulk deleting employees', error: error.message }),
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