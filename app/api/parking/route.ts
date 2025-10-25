import { NextRequest, NextResponse } from 'next/server';
import { getNYCParkingClient } from '@/lib/nyc-parking-client';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const distance = searchParams.get('distance');
  const startTime = searchParams.get('start_time');
  const endTime = searchParams.get('end_time');

  // Validate required parameters
  if (!lat || !lng) {
    return NextResponse.json(
      { error: 'Missing required parameters: lat and lng' },
      { status: 400 }
    );
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  const searchDistance = distance ? parseFloat(distance) : 0.5;

  // Validate coordinates
  if (isNaN(latitude) || isNaN(longitude)) {
    return NextResponse.json(
      { error: 'Invalid coordinates' },
      { status: 400 }
    );
  }

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return NextResponse.json(
      { error: 'Coordinates out of range' },
      { status: 400 }
    );
  }

  try {
    const client = getNYCParkingClient();
    const parkingData = await client.getParkingData(latitude, longitude, searchDistance);

    return NextResponse.json(parkingData);
  } catch (error) {
    console.error('[Parking API] Error:', error);
    return NextResponse.json(
      {
        facilities: [],
        lastUpdated: Date.now(),
        error: 'Failed to fetch parking data',
      },
      { status: 500 }
    );
  }
}
