# Customer Spending Insights Dashboard

A responsive personal finance dashboard built with **React 19**, **TypeScript**, and **Tailwind CSS v4** that visualizes customer spending habits, category distributions, monthly trends, and transaction history in South African Rand (`ZAR`).

---

## Features

- **Timeframe Switching**: View spending insights across the last **7 days (`7d`)**, **30 days (`30d`)**, or **90 days (`90d`)**.
- **Hero Spending Summary**: Displays total outflow, period-over-period percentage change with semantic status badges, transaction volume, and top spending category. Dynamically pivots to category-specific metrics when a category filter is active.
- **Interactive Category Distribution**: Donut chart and ranked breakdown showing where money went. Clicking a slice, category row, or chip in the Quick Actions filter panel cross-filters the Hero Card and Transaction List.
- **Monthly Spending Trend**: Area chart visualizing 6-month spending history alongside the monthly average in `ZAR`.
- **Collapsible Infinite-Scroll Transactions**: Filterable transaction feed with category colour badges, payment method details, collapsible view, and `IntersectionObserver`-driven pagination (`Load more` fallback).
- **Accessible & Resilient UI**: Skeleton loaders during fetches, manual refresh feedback, graceful error states with retry actions, and keyboard/screen-reader accessibility.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build Tool** | [Vite 8](https://vite.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Charts** | [Recharts 3](https://recharts.org/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Testing** | [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) + `jsdom` |
| **Mock Backend** | [`json-server`](https://github.com/typicode/json-server) |
| **Containerization** | Docker + Docker Compose + Nginx |

---

## Getting Started

### Prerequisites

- **Node.js** `>= 20.x` and **npm** (for local development)
- **Docker** & **Docker Compose** (optional, for containerized setup)

---

### Option 1: Run Locally

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables**

   Ensure a `.env` file exists in the project root pointing to the mock API server:

   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```

3. **Start the Mock API server** (in one terminal)

   ```bash
   npx json-server@0.17.4 --watch data/db.json --routes data/routes.json --port 5000
   ```

4. **Start the Vite development server** (in a second terminal)

   ```bash
   npm run dev
   ```

   Open the URL shown in the terminal (typically `http://localhost:5173`).

---

### Option 2: Run with Docker Compose

Spin up both the `json-server` mock API and the production Nginx frontend container with a single command:

```bash
docker compose up --build
```

- **Frontend Dashboard**: `http://localhost:3001`
- **Mock API**: `http://localhost:5000`

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server with HMR |
| `npm run build` | Type-checks with `tsc -b` and builds the production bundle into `dist/` |
| `npm run preview` | Locally previews the production build |
| `npm test` | Runs the unit and component test suite once via Vitest |
| `npm run lint` | Runs ESLint across the codebase |

---

## Project Structure

```text
spending-dashboard/
├── data/
│   ├── db.json                  # Mock customer profile, summaries, categories, trends & transactions
│   └── routes.json              # Custom route mappings for json-server
├── src/
│   ├── components/
│   │   └── dashboard/
│   │       ├── __tests__/       # Component unit & integration tests
│   │       ├── CategoryDistribution.tsx
│   │       ├── CategoryFilterPanel.tsx
│   │       ├── DashboardLayout.tsx
│   │       ├── HeroSpendingCard.tsx
│   │       ├── QuickActions.tsx
│   │       ├── SpendingTrendChart.tsx
│   │       └── TransactionList.tsx
│   ├── hooks/
│   │   └── useSpendingData.ts   # Data fetching, period & category filter state hook
│   ├── services/
│   │   └── spendingService.ts   # Typed REST API client
│   ├── types/
│   │   └── spending.ts          # Domain TypeScript interfaces
│   ├── utils/
│   │   ├── __tests__/           # Utility unit tests
│   │   └── formatCurrency.ts    # ZAR currency and percentage formatters
│   ├── App.tsx                  # Root dashboard composition
│   ├── index.css                # Tailwind CSS v4 theme tokens & utilities
│   └── main.tsx                 # Application entry point
├── Dockerfile                   # Multi-stage Node 20 build -> Nginx Alpine image
├── docker-compose.yml           # Orchestrates mock-api (:5000) and frontend (:3001)
├── vite.config.ts               # Vite configuration
└── vitest.config.ts             # Vitest & jsdom test configuration
```

---

## Mock API Endpoints

Served from `data/db.json` and `data/routes.json` on `http://localhost:5000`:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/profile` | Customer profile details (`name`, `accountType`, `currency`, etc.) |
| `GET` | `/summary?period={7d\|30d\|90d\|1y}` | Aggregated spending summary and period-over-period delta |
| `GET` | `/categories?period={period}` | Spending breakdown by category (`amount`, `percentage`, `color`, `icon`) |
| `GET` | `/trends?months=6` | Monthly spending totals and transaction averages |
| `GET` | `/goals` | Monthly category budget goals and status |
| `GET` | `/transactions?category={name}` | Transaction ledger (optionally filtered by category) |
