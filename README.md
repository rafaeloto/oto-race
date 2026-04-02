# Oto Race - Race Experience Platform

A Next.js platform for Oto Race. Provides driver content with real-time racing data and championship standings.

## Features

- **Dynamic Driver Pages**: Individual pages for each driver with comprehensive race data
- **Real-Time F1 Data**: Live driver information, race results, and championship standings via 'OpenF1 API'
- **Championship Tables**: Complete Teams and Drivers championship standings with position changes
- **Audio Experience**: Immersive engine sounds that play when visiting driver pages
- **Race Session Results**: Latest race performance data including position, laps, time, and gaps
- **Circuit Information**: Detailed circuit data with images, locations, and country flags
- **Driver Headshots**: Professional driver photos with team color integration
- **QR Code Integration**: Direct links from shirt QR codes to driver experiences
- **Responsive Design**: Mobile-first design optimized for QR code scanning
- **Performance Optimized**: Next.js native caching for 5-minute data refresh

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **OpenF1 API** for real-time race data
- **Next.js Image Optimization** for performance
- **Vercel** for deployment

## Data Sources

- **OpenF1 API** (https://openf1.org/) - Real-time race driver, session, and championship data
- **Driver Headshots** - Official race media assets
- **Circuit Images** - Official race circuit photography

## Audio Credits

- "live formula 1 racing 4" by Geoff-Bremner-Audio - License: Creative Commons 0
- "Sport News Music" by humanoide9000 - License: Attribution 4.0

## API Endpoints Used

- `/drivers` - Driver information and headshots
- `/sessions` - Race session data
- `/meetings` - Circuit and location information
- `/session_result` - Race results and performance data
- `/championship_teams` - Teams championship standings
- `/championship_drivers` - Drivers championship standings

## Key Features

### Driver Pages

- Personal driver information with headshots and team colors
- Latest race session results with detailed performance metrics
- Circuit information with images and location data
- Championship standings for both teams and drivers
- Position changes and points gained indicators

### Championship Tables

- Real-time teams championship standings
- Drivers championship standings with headshots
- Position change indicators (↑ for gains, ↓ for losses)
- Points gained visualization
- Current driver highlighting with team colors

### Data Handling

- 5-minute cache for optimal performance
- Graceful fallback to mock data if API fails
- Duplicate driver filtering and data validation
- Error handling and logging

## Performance

- **Static Generation**: Fast loading with Next.js SSG
- **Image Optimization**: Next.js Image component with lazy loading
- **API Caching**: Native Next.js fetch cache with 5-minute revalidation
- **Responsive Design**: Mobile-optimized for QR code scanning

## Deployment

The application is optimized for Vercel deployment with automatic static generation and API route handling.

## URLs

```

https://oto-race.vercel.app/pilot/{driver-id}

```

Examples:

- Lewis Hamilton: `/pilot/lewis-hamilton`
- Max Verstappen: `/pilot/max-verstappen`
- Charles Leclerc: `/pilot/charles-leclerc`

The app is optimized for Vercel's Edge Network with static generation.

```

```
