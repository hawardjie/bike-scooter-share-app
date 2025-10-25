# Bike & Scooter Sharing

A modern, real-time dashboard designed to provide comprehensive monitoring and analysis of bike and scooter sharing systems across various cities. Utilizing GBFS (General Bikeshare Feed Specification) data from multiple operators, the platform aggregates and displays up-to-the-minute information on fleet availability, vehicle locations, and station status. Its intuitive interface allows city planners, operators, and everyday users to easily track live trends, optimize routes, and make data-driven decisions for enhanced mobility and urban planning.

## Features

- **Real-time Data**: Live availability updates every 30 seconds from GBFS feeds
- **Multiple Operators**: Support for major bike/scooter share operators including:
  - Citi Bike (NYC)
  - Bay Wheels (San Francisco)
  - Bluebikes (Boston)
  - Divvy (Chicago)
  - Capital Bikeshare (Washington DC)
  - BIXI Montréal
  - Bike Share Toronto
  - And more...

- **Parking Integration**: 🅿️ NEW! Integration with NYC Open Data and Data.gov for parking locations
  - Parking lot and facility locations near bike/scooter stations
  - Detailed parking facility information (type, capacity, operator)
  - Data from public open datasets - no API keys required
  - Toggle parking display on/off

- **Interactive Map**: View all stations, free-floating vehicles, and parking locations on an interactive map
- **Station Details**: See real-time availability of bikes, scooters, and docks
- **Battery Information**: Track battery levels for electric vehicles
- **Search & Filter**: Find stations and parking by name or location
- **Operator Selection**: View data from specific operators or aggregate multiple sources
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern, utility-first styling
- **React Leaflet** - Interactive maps
- **SWR** - Data fetching with automatic revalidation
- **GBFS** - Standard API for bikeshare data
- **NYC Open Data & Data.gov** - Public parking facility data

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd bike-scooter-share-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` to enable/disable parking integration:
   ```
   NEXT_PUBLIC_ENABLE_PARKING=true
   ```

   **Note:** Parking data is sourced from public open datasets (NYC Open Data and Data.gov). No API keys are required.

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### View All Operators
By default, the dashboard shows data from the top 3 operators for quick loading.

### Select Specific Operator
Use the operator dropdown to select a specific bike/scooter share system and view detailed data.

### Search Stations
Use the search box to find stations by name or address.

### Map Interaction
- Click on station markers to view details
- **Bike/Scooter Stations:**
  - Green circular markers indicate high availability
  - Yellow markers indicate medium availability
  - Red markers indicate low availability
  - Small circles represent free-floating bikes/scooters
- **Parking Locations:**
  - Purple/pink gradient square markers with 🅿️ icon
  - Click to view facility type, capacity, and location details
  - Distinguished visual style for easy identification

### Parking Features
- **Toggle Display**: Use the expandable filter sidebar to show/hide parking locations
- **Public Data Sources**: Parking data from NYC Open Data and Data.gov - completely free with no rate limits
- **Smart Caching**: Parking data is cached for better performance
- **Visual Distinction**: Parking locations use a unique purple/pink gradient design to stand out from bike stations

## API Routes

### Get GBFS Data
```
GET /api/gbfs?operator=<operator-id>
```
Fetches real-time data for a specific operator or all operators.

### List Operators
```
GET /api/gbfs/operators
```
Returns list of all available GBFS operators.

### Get Parking Data
```
GET /api/parking?lat=<latitude>&lng=<longitude>&distance=<miles>
```
Fetches parking facilities from NYC Open Data and Data.gov near the specified coordinates.

**Parameters:**
- `lat` (required): Latitude coordinate
- `lng` (required): Longitude coordinate
- `distance` (optional): Search radius in miles (default: 1.0)

**Response:**
```json
{
  "facilities": [...],
  "lastUpdated": 1234567890,
  "sourcesUsed": ["nyc_open_data"],
  "fallbackNote": null
}
```

**Data Sources:**
- NYC Open Data: Parking lots and facilities in New York City
- Data.gov: Additional parking facilities across the US
- All sources are public and require no authentication

## GBFS Specification

This app implements the GBFS v3.0 specification. Learn more at [gbfs.org](https://gbfs.org).

## Development

### Project Structure
```
bike-scooter-share-app/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── gbfs/            # GBFS endpoints
│   │   └── parking/         # Parking API endpoints
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/              # React components
│   ├── Dashboard.tsx        # Main dashboard
│   ├── MapClient.tsx        # Map visualization
│   ├── MapWrapper.tsx       # Map wrapper for SSR
│   ├── StationCard.tsx      # Station display card
│   ├── ParkingCard.tsx      # Parking location card
│   ├── StatsOverview.tsx    # Statistics panel
│   └── ...
├── lib/                     # Utilities and clients
│   ├── gbfs-client.ts       # GBFS API client
│   ├── nyc-parking-client.ts # NYC Open Data parking client
│   └── gbfs-operators.ts    # Operator configurations
├── types/                   # TypeScript definitions
│   ├── gbfs.ts              # GBFS type definitions
│   └── parking.ts           # Parking type definitions
├── .env.example             # Environment variables template
└── public/                  # Static assets
```

### Adding New Operators

To add a new GBFS operator, edit `lib/gbfs-operators.ts`:

```typescript
{
  id: 'unique-id',
  name: 'System Name',
  location: 'City, State/Country',
  gbfsUrl: 'https://example.com/gbfs/gbfs.json',
  website: 'https://example.com'
}
```

## Building for Production

```bash
npm run build
npm start
```

## License

See LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_ENABLE_PARKING` | No | `true` | Enable/disable parking integration (NYC Open Data / Data.gov) |

## Troubleshooting

### Parking Data Not Showing
1. Check that `NEXT_PUBLIC_ENABLE_PARKING=true` in your `.env.local`
2. Verify the "Show Parking Locations" checkbox is enabled in the filter sidebar
3. Check browser console for API errors
4. Parking data is primarily available for NYC area - try moving the map to New York City
5. Increase the search radius if needed

### No Rate Limit Issues
- All parking data is from public open datasets
- No API keys required
- No rate limits to worry about

### Map Markers Not Appearing
- Ensure JavaScript is enabled
- Check that your location has available bike/scooter stations
- Try zooming in/out on the map
- Verify the operator selector is showing data

## Acknowledgments

- [MobilityData](https://mobilitydata.org) for maintaining the GBFS specification
- All bike and scooter share operators providing public GBFS feeds
- [NYC Open Data](https://data.cityofnewyork.us/) for parking facility data
- [Data.gov](https://data.gov/) for additional public datasets
- OpenStreetMap contributors for map data
