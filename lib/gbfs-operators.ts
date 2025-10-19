// List of public GBFS operators with their auto-discovery URLs
export interface GBFSOperator {
  id: string;
  name: string;
  location: string;
  gbfsUrl: string;
  website?: string;
}

export const GBFS_OPERATORS: GBFSOperator[] = [
  {
    id: 'citibike-nyc',
    name: 'Citi Bike',
    location: 'New York City, NY',
    gbfsUrl: 'https://gbfs.lyft.com/gbfs/2.3/bkn/gbfs.json',
    website: 'https://citibikenyc.com'
  },
  {
    id: 'bay-wheels',
    name: 'Bay Wheels',
    location: 'San Francisco Bay Area, CA',
    gbfsUrl: 'https://gbfs.lyft.com/gbfs/2.3/bay/gbfs.json',
    website: 'https://www.lyft.com/bikes/bay-wheels'
  },
  {
    id: 'bluebikes',
    name: 'Bluebikes',
    location: 'Boston, MA',
    gbfsUrl: 'https://gbfs.lyft.com/gbfs/2.3/bos/gbfs.json',
    website: 'https://www.bluebikes.com'
  },
  {
    id: 'divvy',
    name: 'Divvy',
    location: 'Chicago, IL',
    gbfsUrl: 'https://gbfs.lyft.com/gbfs/2.3/chi/gbfs.json',
    website: 'https://www.divvybikes.com'
  },
  {
    id: 'capital-bikeshare',
    name: 'Capital Bikeshare',
    location: 'Washington, DC',
    gbfsUrl: 'https://gbfs.lyft.com/gbfs/2.3/dca/gbfs.json',
    website: 'https://www.capitalbikeshare.com'
  },
  {
    id: 'bixi-montreal',
    name: 'BIXI Montréal',
    location: 'Montreal, QC, Canada',
    gbfsUrl: 'https://gbfs.velobixi.com/gbfs/gbfs.json',
    website: 'https://www.bixi.com'
  },
  {
    id: 'bike-share-toronto',
    name: 'Bike Share Toronto',
    location: 'Toronto, ON, Canada',
    gbfsUrl: 'https://tor.publicbikesystem.net/customer/gbfs/v2/gbfs.json',
    website: 'https://bikesharetoronto.com'
  },
  {
    id: 'coast-bike-share',
    name: 'Coast Bike Share',
    location: 'Tampa Bay, FL',
    gbfsUrl: 'https://gbfs.lyft.com/gbfs/2.3/tbw/gbfs.json',
    website: 'https://www.coastbikeshare.com'
  }
];
