# Backend for SolarConnect

This directory contains the Node.js and Express.js backend for the SolarConnect application.

## Setup

1.  Navigate to the `backend` directory: `cd backend`
2.  Install dependencies: `npm install`
3.  Create a `.env` file if it doesn't exist (you can copy `.env.example` if provided) and set necessary environment variables (e.g., `PORT`).
4.  Start the server: `npm start` (you'll need to add a "start" script to `package.json`: `"start": "node server.js"`)

## API Endpoints

*   `/api/health`: Returns the health status of the backend.
