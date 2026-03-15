# WEN Frontend

WEN Frontend is the web interface for an **appointment management system designed for students and teachers**. It provides the client-side experience for scheduling, viewing, and managing appointments in an academic setting.

Students can use the app to request and track consultations, while teachers can review requests, manage schedules, and handle appointment flow efficiently.

## Project Architecture

This repository contains the **frontend** built with Next.js.

The corresponding backend API for this project is in:

- https://github.com/RollieGarcia0031/wen-backend.git

## Getting Started

### Prerequisites

- Node.js 18+ (recommended)
- npm (or yarn/pnpm/bun)

### 1) Clone and install dependencies

```bash
git clone https://github.com/RollieGarcia0031/wen-frontend
cd wen-frontend
npm install
```

### 2) Configure environment variables

Create a `.env.local` file in the project root and add the variables required by the app (for example, the backend API URL). Use the backend repository documentation as reference for API setup.

### 3) Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Run production build
npm run lint     # Run linter
```

## Tech Stack

- [Next.js](https://nextjs.org)
- React
- TypeScript

## Notes

For full end-to-end functionality, make sure the backend service is running and accessible by this frontend.
