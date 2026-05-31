# K-MATE Frontend

AI-powered Korean learning platform frontend built with Next.js 14.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI Library**: Ant Design 5
- **CSS**: TailwindCSS 3
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Real-time**: Socket.IO Client
- **Form Handling**: React Hook Form + Zod
- **Video Player**: Video.js

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_WS_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Project Structure

```
kmatefrontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Landing page
│   ├── components/            # React components
│   │   ├── layout/           # Layout components
│   │   └── landing/           # Landing page components
│   ├── lib/                   # Utilities
│   │   ├── api.ts            # Axios client
│   │   ├── query-provider.tsx # React Query setup
│   │   └── socket-provider.tsx # Socket.IO setup
│   ├── store/                 # Zustand stores
│   │   ├── auth.store.ts     # Auth state
│   │   ├── flashcard.store.ts # Flashcard state
│   │   └── video.store.ts    # Video state
│   └── styles/
│       └── globals.css        # Global styles + TailwindCSS
├── public/                    # Static assets
├── packages/
│   └── shared-types/          # Shared TypeScript types
└── __tests__/                 # Test files
```

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking
npm run test         # Run tests
```

## Testing

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:cov
```

## Docker

```bash
# Build Docker image
docker build -t kmate-frontend .

# Run container
docker run -p 3000:3000 kmate-frontend
```

## Features

- Landing page with features showcase
- User authentication (OAuth ready)
- Video learning with subtitle display
- Flashcard management with SM-2 algorithm
- Quiz system
- Real-time notifications via Socket.IO
- Dark mode support
- Responsive design

## License

Private - All rights reserved
