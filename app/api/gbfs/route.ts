import { NextRequest, NextResponse } from 'next/server';
import { GBFSClient } from '@/lib/gbfs-client';
import { GBFS_OPERATORS } from '@/lib/gbfs-operators';

export const dynamic = 'force-dynamic';
export const revalidate = 30;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const operatorId = searchParams.get('operator');

  try {
    // If specific operator requested
    if (operatorId) {
      const operator = GBFS_OPERATORS.find(op => op.id === operatorId);

      if (!operator) {
        return NextResponse.json(
          { error: 'Operator not found' },
          { status: 404 }
        );
      }

      const client = new GBFSClient(operator.gbfsUrl);
      const data = await client.getAllData();

      if (!data) {
        console.error(`[GBFS API] Failed to fetch data for operator: ${operator.name}`);
        return NextResponse.json(
          {
            error: 'Failed to fetch data from operator',
            operator: operator.name,
            url: operator.gbfsUrl
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        operator: {
          id: operator.id,
          name: operator.name,
          location: operator.location,
        },
        data,
      });
    }

    // Otherwise, fetch data from all operators (limited for performance)
    const operatorsToFetch = GBFS_OPERATORS.slice(0, 3); // Limit to 3 for initial load

    const results = await Promise.allSettled(
      operatorsToFetch.map(async (operator) => {
        const client = new GBFSClient(operator.gbfsUrl);
        const data = await client.getAllData();

        return {
          operator: {
            id: operator.id,
            name: operator.name,
            location: operator.location,
          },
          data,
        };
      })
    );

    const successfulResults = results
      .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
      .map(result => result.value)
      .filter(result => result.data !== null);

    return NextResponse.json({
      operators: successfulResults,
      total: GBFS_OPERATORS.length,
    });
  } catch (error) {
    console.error('Error in GBFS API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
