import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Employee from '@/models/employees';

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'PUT, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}

export async function PUT(req: Request) {
    try {
        await connectToDatabase();
        const body = await req.json();
        const { ids, updates } = body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return new NextResponse(
                JSON.stringify({ message: 'No employee IDs provided for bulk update.' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
                }
            );
        }

        if (!updates || Object.keys(updates).length === 0) {
            return new NextResponse(
                JSON.stringify({ message: 'No update fields provided for bulk update.' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
                }
            );
        }

        const validUpdates: { [key: string]: any } = {};
        for (const key in updates) {
            if (updates[key] !== '') {
                validUpdates[key] = updates[key];
            }
        }

        if (Object.keys(validUpdates).length === 0) {
             return new NextResponse(
                JSON.stringify({ message: 'No valid update fields provided. All fields were empty.' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
                }
            );
        }

        const result = await Employee.updateMany(
            { _id: { $in: ids } },
            { $set: validUpdates },
            { runValidators: true }
        );

        return new NextResponse(
            JSON.stringify({
                message: `${result.modifiedCount} employees updated successfully!`,
                modifiedCount: result.modifiedCount
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
        console.error("Error bulk updating employees:", error);
        return new NextResponse(
            JSON.stringify({ message: 'Error bulk updating employees', error: error.message }),
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