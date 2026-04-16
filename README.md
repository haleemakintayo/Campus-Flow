# CampusFlow: Transit Management System

## Overview
CampusFlow is a real-time transit management application designed to help university administrators and students track buses, predict crowd capacities, and optimize campus transit routes.

## Features
- **Real-Time Bus Tracking**: View the live location, heading, and status of all campus buses on an interactive dark-mode map.
- **Occupancy Monitoring**: Track how crowded buses are currently and view real-time warnings when capacity limits are approached.
- **Route Planning**: Search easily for specific routes and visualize the exact stops mapping.
- **AI-Powered Insights**: (Demo feature utilizing Gemini) Generates crowd predictions and intelligent transit recommendations.
- **Sleek Interface**: Built with an edge-to-glass, highly customized dashboard using Tailwind CSS and Radix UI primitives.

## Data Model
- **Routes**: Connect campus locations together (e.g., *Main Campus Loop*, *Outer Campus Express*).
- **Stops**: Key pickup/drop-off points. Currently includes: *Ago Mini Campus, Mariam, Itamerin, Pepsi, Chips, Konigba*.
- **Buses**: Vehicles assigned to specific routes with live telemetry (latitude, longitude, occupancy, heading).

## Authentication
By default, the application implements **Firebase Authentication** mapped to a secure profile system. We have additionally included a **"Use Demo Account"** button for evaluators to bypass the Google Login popup and gain full system access seamlessly.

## Tech Stack
- Frontend: React (Vite)
- Language: TypeScript
- Core Map: Leaflet (`react-leaflet`)
- Database: Firebase Firestore (Real-time listeners)
- Auth: Firebase Authentication
- UI Components: shadcn/ui, Tailwind CSS
- Tooling: Lucide React (Icons), Recharts (Analytics graph)
