# D365FO Warehouse Digital Twin — Complete Build Guide

> **One-shot, paste-every-file guide.** Follow sections 1–12 in order and you will have a running Warehouse Digital Twin visualisation — no extra downloads, no guesswork.

---

## 1  Prerequisites

| Tool | Minimum version |
|------|----------------|
| **Node.js** | 18 LTS (20 LTS recommended) |
| **npm** | 9 + (ships with Node 18+) |
| **Git** | any recent version |

You can also use **pnpm** or **yarn** — substitute the relevant commands below.

## 2  Scaffold the Vite + React + TypeScript Project

```bash
npm create vite@latest "DIGITAL TWIN" -- --template react-ts
cd "DIGITAL TWIN"
```

## 3  Install Dependencies

```bash
# 3-D engine
npm install three @react-three/fiber @react-three/drei

# State management
npm install zustand

# Charting
npm install recharts

# Date utilities
npm install date-fns

# Spreadsheet & CSV import (optional — for future data import)
npm install xlsx papaparse

# Tailwind CSS (dev)
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## 4  Project Structure

The application is organized as follows:

```
src/
├── App.tsx
├── index.css
├── main.tsx
├── vite-env.d.ts
├── components/
│   ├── three/
│   │   ├── LocationBox.tsx
│   │   ├── WarehouseScene.tsx
│   │   └── ZoneFloor.tsx
│   └── ui/
│       ├── KPIDashboard.tsx
│       ├── Legend.tsx
│       ├── LocationDetailPanel.tsx
│       └── Toolbar.tsx
├── data/
│   └── sampleWarehouse.ts
├── models/
│   ├── enums.ts
│   ├── index.ts
│   ├── inventory.ts
│   └── warehouse.ts
├── store/
│   └── warehouseStore.ts
└── utils/
    ├── colorMapping.ts
    ├── layoutEngine.ts
    └── viewModes.ts
```

## Features

### Six Interactive View Modes
- **Location Type** - Color by warehouse function (Receiving, Dispatch, Quality, etc.)
- **Activity Heat Map** - Visualize movement frequency (cold to hot)
- **ABC Classification** - Velocity-based slotting analysis
- **Inventory Aging** - Identify slow-moving stock (0-90+ days)
- **Cycle Count Status** - Track inventory count scheduling
- **Space Utilization** - Monitor location fill percentages

### Real-Time UI Controls
- **Toolbar** with view mode selector, search, theme toggle, KPI panel toggle
- **Legend** showing active view mode color coding
- **KPI Dashboard** with summary cards, charts, and breakdown visualizations
- **Location Detail Panel** showing inventory items, capacity, and metadata

### Interactive 3D Scene
- Click any location to view details
- Search by location ID, item number, license plate, or batch
- Orbit controls for 3D navigation
- Theme switcher (dark/light mode)
- Hover tooltips with location information

## 13  Run, Build & Preview

```bash
# Install dependencies
npm install

# Development server (hot-reload)
npm run dev

# Production build
npm run build

# Preview the production build locally
npm run preview

# Lint check
npm run lint
```

Open **http://localhost:5173** (default Vite port) in your browser.

## 14  Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                        App.tsx (shell)                           │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │               WarehouseScene  (Three.js)                 │    │
│  │   ┌────────────┐  ┌────────────┐  ┌────────────┐        │    │
│  │   │ ZoneFloor   │  │ LocationBox│  │ LocationBox│ · · ·  │    │
│  │   └────────────┘  └────────────┘  └────────────┘        │    │
│  └──────────────────────────────────────────────────────────┘    │
│  ┌─────┐  ┌────────┐  ┌───────────┐  ┌──────────────────┐      │
│  │Toolbar│ │ Legend  │  │ KPI Dash  │  │ Location Detail  │      │
│  └─────┘  └────────┘  └───────────┘  └──────────────────┘      │
└──────────────────────────────────────────────────────────────────┘
                           │
                    ┌──────┴──────┐
                    │  Zustand    │
                    │  Store      │
                    └──────┬──────┘
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
      layoutEngine   colorMapping   viewModes
             │             │             │
             └─────────────┼─────────────┘
                           ▼
                    Domain Models
              (enums, warehouse, inventory)
                           │
                           ▼
                  sampleWarehouse.ts
                  (demo data generator)
```

### Data Flow

1. **`sampleWarehouse.ts`** generates warehouse configuration (zones, aisles, racks, locations) plus randomized inventory, velocity, and cycle-count data.
2. **`warehouseStore.ts`** (Zustand) holds all state and exposes actions.
3. When view mode changes, store calls **`buildRenderedLocations()`** which computes 3D positions and colors for every location.
4. **`WarehouseScene.tsx`** renders each location as a **`LocationBox`** mesh and each zone as a **`ZoneFloor`** plane.
5. **UI components** subscribe to the store and render overlays.

---

*Generated by the BUILD_GUIDE generator.*
