# Bike & Scooter Sharing

A modern, real-time dashboard for monitoring bike and scooter sharing systems using GBFS (General Bikeshare Feed Specification) data from multiple operators.

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

- **Interactive Map**: View all stations and free-floating vehicles on an interactive map
- **Station Details**: See real-time availability of bikes, scooters, and docks
- **Battery Information**: Track battery levels for electric vehicles
- **Search & Filter**: Find stations by name or location
- **Operator Selection**: View data from specific operators or aggregate multiple sources
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern, utility-first styling
- **React Leaflet** - Interactive maps
- **SWR** - Data fetching with automatic revalidation
- **GBFS** - Standard API for bikeshare data

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

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### View All Operators
By default, the dashboard shows data from the top 3 operators for quick loading.

### Select Specific Operator
Use the operator dropdown to select a specific bike/scooter share system and view detailed data.

### Search Stations
Use the search box to find stations by name or address.

### Map Interaction
- Click on station markers to view details
- Green markers indicate high availability
- Yellow markers indicate medium availability
- Red markers indicate low availability
- Small circles represent free-floating bikes/scooters

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

## GBFS Specification

This app implements the GBFS v3.0 specification. Learn more at [gbfs.org](https://gbfs.org).

## Development

### Project Structure
```
bike-scooter-share-app/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   └── gbfs/            # GBFS endpoints
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/              # React components
│   ├── Dashboard.tsx        # Main dashboard
│   ├── Map.tsx              # Map visualization
│   ├── StationCard.tsx      # Station display card
│   ├── StatsOverview.tsx    # Statistics panel
│   └── ...
├── lib/                     # Utilities and clients
│   ├── gbfs-client.ts       # GBFS API client
│   └── gbfs-operators.ts    # Operator configurations
├── types/                   # TypeScript definitions
│   └── gbfs.ts              # GBFS type definitions
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

## Acknowledgments

- [MobilityData](https://mobilitydata.org) for maintaining the GBFS specification
- All bike and scooter share operators providing public GBFS feeds
- OpenStreetMap contributors for map data
