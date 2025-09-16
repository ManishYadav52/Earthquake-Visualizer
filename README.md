# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.






# Earthquake Visualizer

## Summary
Earthquake Visualizer is a **React + Vite** application that visualizes recent earthquakes from **USGS** on an interactive **Leaflet** map.  
It is designed for geography students and enthusiasts to explore seismic patterns with filters, time ranges, and interactive features.

## Data Source
USGS GeoJSON feeds (auto-refresh every 60s):
- **1 hour:** [all_hour.geojson](https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson)  
- **24 hours:** [all_day.geojson](https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson)  
- **7 days:** [all_week.geojson](https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson)  

## Tech Stack
- **Frontend:** React (Vite), Tailwind CSS v4  
- **Map:** react-leaflet (Leaflet)  
- **Data Fetching:** Axios  

## Features
- **Interactive map:** pan/zoom, dark/light tiles, scale control, legend.  
- **Color-coded markers by magnitude:** red (>=6), orange (4–5.9), yellow (<4) with popups showing place, magnitude, depth, and time.  
- **Sidebar list:** synced with map; click an item to pan/zoom to that earthquake.  
- **Header controls:** select time range (1h/24h/7d), search by place, minimum magnitude slider, Reset view, theme toggle.  
- **Loading skeleton and error banner** for better UX.  
- **Shareable URL:** retains feed, search query, and min magnitude in query params.  

## Project Structure
index.html - Base HTML document with SEO meta
src/
├─ main.jsx - App bootstrap (includes Leaflet CSS)
├─ index.css - Tailwind import + custom pulse animation
├─ App.jsx - App shell, data fetching, header controls, filters, layout
└─ Components/
├─ MapView.jsx - Map, markers, legend, scale, focus controller
├─ Sidebar.jsx - Sidebar list, click-to-focus functionality
└─ ThemeToggle.jsx - Dark/light toggle switch


## Data Flow
1. `App.jsx` fetches the selected USGS feed and stores earthquake features.  
2. Filters (search and min magnitude) apply to both **Sidebar** and **MapView**.  
3. Clicking a **Sidebar** item sets focus; **MapView** flies to that location.  
4. Data refreshes every 60 seconds automatically.  

## Design Notes
- Sticky glass header, responsive layout, high contrast.  
- Magnitude colors: **red (>=6)**, **orange (4–5.9)**, **yellow (<4)**.  
- High-magnitude markers **pulse animation**.  

## Setup
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build production version
npm run build

# Preview production build
npm run preview



License

Data © USGS

App code under your chosen license

