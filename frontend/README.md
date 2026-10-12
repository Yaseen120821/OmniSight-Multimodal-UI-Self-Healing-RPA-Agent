# OmniSight Frontend

Enterprise SaaS Web Application for **OmniSight: Multimodal UI Self-Healing & RPA Agent**.

Built with [Next.js 16](https://nextjs.org/) App Router, [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), and [Tailwind CSS v4](https://tailwindcss.com/).

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Start the development server
```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build & Verification
```bash
npm run build
npm run lint
```

---

## 🌟 Core Modules

- **Dashboard (`app/page.tsx`)**:
  - Welcome Banner with "Run Full Test Suite" action.
  - 4 Equal KPI Metric Cards (Registered Targets, Test Runs, Pass Rate, Open Defects).
  - Two-Column Analytics Layout:
    - *Left Column*: 7-Day Test Execution Trend stacked bar chart + Self-Healing Performance metrics.
    - *Right Column*: Defect Category Distribution donut chart + Real-time Recent Activity feed.
  - Interactive Table Switcher between **Recent Test Runs** (with View Report and direct Download PDF actions) and **Registered Test Targets**.
- **Projects & Targets (`app/projects/page.tsx`)**:
  - Target inventory with top and bottom dual-pagination (12 items/page).
  - Search, status filtering, and target registration modal.
- **Reports Hub & Individual Report (`app/reports/page.tsx`, `app/reports/[id]/page.tsx`)**:
  - Deep-dive diagnostic view with before/after visual regression wireframes, assertion logs, defect tables, and autonomous self-healing locators.
- **Native Vector PDF Generator (`lib/pdf-generator.ts`)**:
  - Multi-page `jsPDF` vector report generator engineered to avoid `html2canvas` Tailwind CSS v4 color crashes.
- **Central Store Engine (`lib/store.ts`)**:
  - Browser-persisted reactive store with custom event broadcasting (`omnisight_store_update`) ensuring immediate UI synchronization across tabs and pages without full-page reloads.

For detailed system architecture, verification matrix, and technical specs, please refer to the [Root README](../README.md).
