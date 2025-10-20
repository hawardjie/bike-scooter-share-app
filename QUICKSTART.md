# Quick Start Guide

## Your Bike & Scooter Sharing is Ready!

The application is currently running at: **http://localhost:3000**

## What You've Got

A modern, real-time dashboard showing live bike and scooter availability from public GBFS feeds across multiple cities:

### Supported Operators
- **Citi Bike** (New York City)
- **Bay Wheels** (San Francisco Bay Area)
- **Bluebikes** (Boston)
- **Divvy** (Chicago)
- **Capital Bikeshare** (Washington DC)
- **Bike Chattanooga** (Chattanooga)
- **BIXI Montréal** (Montreal)
- **Bike Share Toronto** (Toronto)

### Features
1. **Live Data**: Updates every 30 seconds from real GBFS feeds
2. **Interactive Map**: View all stations and free-floating vehicles
3. **Station Details**:
   - Available bikes/scooters
   - Available docks
   - Battery levels (for electric vehicles)
   - Station status (active/inactive)
4. **Search & Filter**: Find stations by name or address
5. **Operator Selection**: View individual or multiple operators
6. **Responsive Design**: Works on desktop, tablet, and mobile

### Color Coding on Map
- **Green markers**: High availability (>50%)
- **Yellow markers**: Medium availability (20-50%)
- **Red markers**: Low availability (<20%)
- **Small circles**: Free-floating bikes/scooters

## Next Steps

### Development
```bash
npm run dev      # Start development server (already running!)
npm run build    # Build for production
npm start        # Run production server
npm run lint     # Run linter
```

### Adding More Operators

Edit `lib/gbfs-operators.ts` and add new entries:

```typescript
{
  id: 'unique-id',
  name: 'System Name',
  location: 'City, State',
  gbfsUrl: 'https://example.com/gbfs/gbfs.json',
  website: 'https://example.com'
}
```

### Customization Ideas
- Add favorites/bookmarks for stations
- Add route planning between stations
- Show historical availability trends
- Add push notifications for low availability
- Integrate with trip planning apps
- Add weather data overlay

## API Endpoints

### Get Live Data
```
GET /api/gbfs?operator=citibike-nyc
```

### List All Operators
```
GET /api/gbfs/operators
```

## Technologies Used
- Next.js 15 (React framework)
- TypeScript (type safety)
- Tailwind CSS (styling)
- React Leaflet (maps)
- SWR (data fetching)
- GBFS v3.0 (data standard)

## Troubleshooting

### Map not loading?
- Check browser console for errors
- Ensure Leaflet CSS is loaded
- Check network tab for GBFS API calls

### No data showing?
- Verify GBFS feed URLs are accessible
- Check API route responses in browser DevTools
- Some operators may have rate limits

## Resources
- [GBFS Specification](https://gbfs.org)
- [Next.js Docs](https://nextjs.org/docs)
- [React Leaflet Docs](https://react-leaflet.js.org)

Enjoy your bike share dashboard!
