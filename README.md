# Gym Finder

A React Native mobile app built with Expo Router.

## Requirements

- Node.js 18+
- npm or yarn or pnpm
- [Expo Go](https://expo.dev/go) app on your phone (for quick testing), or Android/iOS simulator

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm start
# or
npx expo start
```

Then scan the QR code with Expo Go, or press `a` for Android emulator / `i` for iOS simulator.

### Platform-specific

```bash
npm run android   # Android emulator / device
npm run ios       # iOS simulator (macOS only)
npm run web       # Web browser
```

## Project Structure

```
gym-finder/
├── api/          # API client (axios setup, auth & gym endpoints)
├── app/          # Expo Router screens
│   ├── (tabs)/   # Tab-based navigation
│   ├── gym/      # Gym detail screen
│   ├── sign-in   # Authentication screens
│   └── register
├── assets/       # Images and static files
├── components/   # Reusable UI components
├── constants/    # Theme colors and constants
├── context/      # React context (theme)
├── store/        # Zustand state (auth)
└── types/        # TypeScript types
```

## API Configuration

The app talks to a backend API. Update the base URL in `api/axios.ts`:

```ts
const BASE_URL = "http://localhost:4000"; // change to your API server
```

For physical device testing, replace `localhost` with your machine's local IP address.

## Environment

This is a standalone Expo project. No monorepo tooling required.
