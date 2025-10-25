import { NextRequest, NextResponse } from 'next/server';
import { getNYCParkingClient } from '@/lib/nyc-parking-client';
import type { ParkingFacility } from '@/types/parking';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { facilityIds, facilities } = body;

    // Validate required parameters
    if (!facilityIds || !Array.isArray(facilityIds)) {
      return NextResponse.json(
        { error: 'Missing or invalid facilityIds array' },
        { status: 400 }
      );
    }

    if (!facilities || !Array.isArray(facilities)) {
      return NextResponse.json(
        { error: 'Missing or invalid facilities array' },
        { status: 400 }
      );
    }

    const client = getNYCParkingClient();
    const addressMap = await client.getAddressesForFacilities(facilityIds, facilities as ParkingFacility[]);

    // Convert Map to object for JSON response
    const addresses: Record<string, string> = {};
    addressMap.forEach((address, id) => {
      addresses[id] = address;
    });

    return NextResponse.json({ addresses });
  } catch (error) {
    console.error('[Parking Addresses API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch addresses', addresses: {} },
      { status: 500 }
    );
  }
}
