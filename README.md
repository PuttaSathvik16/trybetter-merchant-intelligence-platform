# TryBetter Merchant Intelligence Platform

### A Proposed Feature Build — Data Analyst & Data Engineering Portfolio Project

> **Built for:** [TryBetter (Better Payments)](https://trybetter.co/) — a New Jersey-based payment processing company serving 8,000+ merchants and processing $5B+ in transactions across restaurant, retail, medical, hotel, and e-commerce verticals.
>
> **Why I built this:** After researching TryBetter's product, I identified a critical gap — they have no analytics, data pipeline visibility, or merchant intelligence layer. This project is a fully working prototype of what that layer would look like, built to demonstrate both data engineering and data analysis capabilities directly relevant to their business.

---

## The Problem I Identified

TryBetter's core value proposition is **zero processing fees** through a dual-pricing model. They serve 8,000+ merchants and handle billions in payment volume. But when you look at what exists today:


| What TryBetter Has           | What TryBetter Is Missing                 |
| ---------------------------- | ----------------------------------------- |
| POS terminal hardware        | Merchant savings visibility               |
| Payment processing gateway   | Transaction anomaly detection             |
| Basic online ordering        | ETL pipeline for transaction data         |
| QR-based payments            | Statistical analysis of merchant behavior |
| Manual onboarding            | Merchant churn risk scoring               |
| No merchant portal analytics | Real-time data quality monitoring         |


A payment company of this scale — processing $5B+ — has enormous data sitting idle. This project turns that data into actionable intelligence.

---

## What I Built

A full **React-based Merchant Intelligence Dashboard** with 7 modules, a 4-stage data pipeline simulation, statistical analysis engine, and anomaly detection system — all aligned to TryBetter's brand identity (purple `#7C3AED`, green `#16A34A`).

### Module Overview


| Module                 | Type                  | Business Value                                  |
| ---------------------- | --------------------- | ----------------------------------------------- |
| Main Dashboard         | Data Visualization    | 360° view of merchant activity                  |
| Savings Calculator     | Interactive Tool      | Converts prospects by showing exact fee savings |
| Analytics Page         | Data Analysis         | Statistical insights on transaction patterns    |
| Data Pipeline Monitor  | Data Engineering      | ETL status, data quality, pipeline health       |
| Transactions Table     | Data Management       | Filterable, sortable transaction history        |
| Merchant Health Scores | Predictive Analytics  | Churn risk and health scoring per merchant      |
| Reports                | Business Intelligence | Aggregated savings and performance reports      |


---

## Dashboard Screenshots

### Main Dashboard

Main Dashboard
*Real-time overview: total volume, active merchants, savings vs Stripe, chargeback alerts, transaction table, and 6-month volume trend with payment method breakdown.*

---

### Analytics — Statistical Analysis & Anomaly Detection

<img width="1280" height="900" alt="analytics" src="https://github.com/user-attachments/assets/d2a48ecb-8814-428e-b263-0a2b5578c093" />

Analytics Page
*Descriptive statistics (mean, median, std dev, quartiles) on transaction amounts. Volume by merchant category. Anomaly detection results table flagging high-value outliers and off-hours activity with risk scores.*

---

### Savings Calculator — Embeddable Widget

<img width="1280" height="900" alt="calculator" src="https://github.com/user-attachments/assets/504cc89c-bda7-4319-a10f-cf136f7745b0" />

Savings Calculator
*Live fee comparison across Stripe, Square, and TryBetter. Business-type presets (Restaurant, Retail, E-commerce, Medical) auto-fill realistic volume and ticket defaults. Shows monthly and annual savings dynamically.*

---

### Data Pipeline Monitor — ETL Dashboard

<img width="1280" height="900" alt="dashboard" src="https://github.com/user-attachments/assets/0256ffb4-b8af-4e04-99a3-99ccb445ff56" />

Data Pipeline
*Simulates a real Extract → Transform → Load pipeline with record counts, pass/fail validation, data quality field-by-field breakdown, and a pipeline run history log with status badges.*

---

### Merchant Health Scores — Churn Risk Intelligence

<img width="1280" height="900" alt="merchant_health" src="https://github.com/user-attachments/assets/4294f777-579f-43d9-96b8-42d99ec5f505" />

Merchant Health
*Health score cards (0–100) for every merchant with color-coded risk classification (Excellent / Good / At Risk / Critical), churn risk badges, and filterable views.*

---

## Data Engineering Highlights

<img width="1280" height="900" alt="pipeline" src="https://github.com/user-attachments/assets/b651a097-83ca-41cb-995c-9b3547632816" />

This is the section that makes this project different from a standard frontend build. The data pipeline layer mirrors what a real data engineer would build on top of a payment processing system.

### ETL Pipeline — `src/data/pipeline/etlProcessor.js`

A three-stage pipeline that processes raw transaction records:

```
EXTRACT → TRANSFORM → LOAD
```

**Extract stage** validates every incoming record:

- Checks for required fields: `id`, `date`, `amount`, `merchantName`, `category`, `status`
- Flags records with null values or invalid amounts
- Separates `passed` from `failed` records before any transformation runs

**Transform stage** enriches every valid record with derived fields:

```js
// Fields added during transformation:
date_iso          // Normalized ISO 8601 timestamp
category_normalized // "restaurant" → "QSR/Dining"
fee_saved         // What merchant would have paid at Stripe: vol*0.029 + 0.30
day_of_week       // "Mon", "Tue" ... derived from date
hour_of_day       // Integer 0-23
is_weekend        // Boolean
transformed_at    // Pipeline run timestamp
```

**Load stage** outputs a `pipeline_summary` object alongside clean data:

```js
{
  total_records: 50,
  records_passed: 48,
  records_failed: 2,
  transformation_time_ms: 24,
  run_timestamp: "2024-04-20T10:42:17.000Z",
  status: "SUCCESS"
}
```

---

### Anomaly Detection — `src/data/pipeline/anomalyDetector.js`

Three detection algorithms running on transaction data:

**1. High-Value Outlier Detection**
Uses standard deviation to flag transactions more than 2σ above the mean amount. Any transaction with `amount > mean + (2 * stdDev)` gets flagged with a risk score.

**2. Off-Hours Activity Detection**
Flags transactions occurring between 11pm and 5am. Payment activity outside business hours is a known chargeback risk signal in the payments industry.

**3. Velocity Spike Detection**
Groups transactions by merchant per day. Any merchant showing more than 3x their average daily transaction count on a single day is flagged — a classic fraud velocity pattern.

Each flagged record returns:

```js
{
  transactionId: "TXN-0042",
  merchantName: "Metro Electronics",
  amount: 489.00,
  anomalyType: "High Value Outlier",
  riskScore: 87,
  reason: "Amount $489 is 3.8 std devs above mean ($147)"
}
```

---

### Statistical Analysis Engine — `src/data/pipeline/statsEngine.js`

Functions a data analyst would write for payment reporting:

```js
calculateDescriptiveStats(values)
// Returns: mean, median, std_dev, min, max, q25, q75, count

buildTimeSeriesData(transactions, months)
// Returns: [{month, volume, count, fees_saved}] for last N months

calculateGrowthRate(current, previous)
// Returns: percentage change between periods

calculateCorrelation(xArray, yArray)
// Returns: Pearson correlation coefficient (-1 to 1)
```

---

### Data Aggregation — `src/data/pipeline/aggregator.js`

Clean aggregation functions feeding the chart layer:

```js
aggregateByCategory(transactions)
// Groups by category → { count, total_volume, avg_ticket, fees_saved }

aggregateByDayOfWeek(transactions)
// Returns volume heatmap indexed Monday–Sunday

aggregateByHour(transactions)
// Returns volume distribution by hour 0-23 (feeds heatmap chart)

calculateMerchantKPIs(merchants)
// Per merchant: revenue_per_day, projected_annual_savings, health_trend
```

---

## Fee Calculation Logic — `src/utils/feeCalculator.js`

The core of the Savings Calculator. Calculates exact monthly fees for each processor:

```js
// Stripe: 2.9% of volume + $0.30 per transaction
stripe_fee = (volume * 0.029) + (transactions * 0.30)

// Square: 2.6% of volume + $0.10 per transaction
square_fee = (volume * 0.026) + (transactions * 0.10)

// PayPal: 3.49% of volume + $0.49 per transaction
paypal_fee = (volume * 0.0349) + (transactions * 0.49)

// TryBetter: $0
trybetter_fee = 0

// Savings = max competitor fee
savings = Math.max(stripe_fee, square_fee, paypal_fee)
```

---

## Tech Stack


| Layer              | Technology                | Purpose                                         |
| ------------------ | ------------------------- | ----------------------------------------------- |
| Frontend Framework | React 18                  | Component-based UI                              |
| Build Tool         | Vite                      | Fast dev server and bundler                     |
| Styling            | Tailwind CSS              | Utility-first CSS matching TryBetter brand      |
| Charts             | Recharts                  | Line charts, bar charts, pie charts             |
| Routing            | React Router v6           | Multi-page navigation                           |
| Icons              | Lucide React              | Consistent iconography                          |
| Data Pipeline      | Vanilla JS modules        | ETL simulation, stats engine, anomaly detection |
| Fonts              | Plus Jakarta Sans + Inter | Matching TryBetter's brand typography           |


**No backend required.** All data pipeline logic runs in the browser using pure JavaScript modules — demonstrating that the logic is sound and portable to any backend (Python/Node/SQL) when connected to real data.

---

## Project Structure

```
trybetter-merchant-dashboard/
│
├── screenshots/                        # Dashboard preview images for README
│   ├── dashboard.jpg
│   ├── analytics.jpg
│   ├── calculator.jpg
│   ├── pipeline.jpg
│   └── merchant_health.jpg
│
├── src/
│   ├── data/
│   │   ├── pipeline/                   # DATA ENGINEERING LAYER
│   │   │   ├── etlProcessor.js         # Extract → Transform → Load pipeline
│   │   │   ├── aggregator.js           # Group-by, rollup, KPI calculations
│   │   │   ├── anomalyDetector.js      # Outlier, velocity, off-hours detection
│   │   │   └── statsEngine.js          # Descriptive stats, time series, correlation
│   │   ├── mockTransactions.js         # 50 realistic transaction records
│   │   ├── mockMerchants.js            # 12 merchant profiles with health data
│   │   └── processorRates.js           # Fee structures: Stripe, Square, PayPal, TryBetter
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx             # Navigation with TryBetter branding
│   │   │   ├── TopBar.jsx              # Page header with date selector
│   │   │   └── Layout.jsx              # Wrapper with Outlet for routing
│   │   ├── ui/
│   │   │   ├── StatCard.jsx            # Metric cards with change indicators
│   │   │   ├── Badge.jsx               # Status badges (success/warning/danger)
│   │   │   ├── Button.jsx              # Styled action buttons
│   │   │   └── Tooltip.jsx             # Hover tooltips
│   │   ├── charts/
│   │   │   ├── RevenueLineChart.jsx    # 6-month volume trend (purple gradient)
│   │   │   ├── SavingsBarChart.jsx     # Processor fee comparison bars
│   │   │   ├── TransactionHeatmap.jsx  # Hour × Day volume heatmap
│   │   │   └── ProcessorPieChart.jsx   # Payment method distribution
│   │   └── widgets/
│   │       ├── SavingsCalculator.jsx   # Interactive fee comparison tool
│   │       ├── MerchantHealthScore.jsx # SVG arc score card per merchant
│   │       ├── ChargebackAlert.jsx     # Risk flagged transaction list
│   │       └── RecentTransactions.jsx  # Latest 8 transactions table
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx               # Main overview page
│   │   ├── Analytics.jsx               # Stats + anomaly detection page
│   │   ├── DataPipeline.jsx            # ETL monitor page
│   │   ├── SavingsCalculator.jsx       # Full calculator page
│   │   ├── Transactions.jsx            # Filterable transactions table
│   │   ├── MerchantHealth.jsx          # Health score grid page
│   │   └── Reports.jsx                 # Aggregated BI reports
│   │
│   ├── utils/
│   │   ├── feeCalculator.js            # Core fee math for all processors
│   │   ├── healthScorer.js             # Merchant risk scoring logic
│   │   └── formatters.js               # Currency, date, percent formatters
│   │
│   ├── App.jsx                         # Router configuration
│   ├── main.jsx                        # React entry point
│   └── index.css                       # Global styles + Tailwind base
│
├── public/
│   └── index.html
├── tailwind.config.js                  # Brand colors + font config
├── vite.config.js
├── package.json
└── README.md
```

---

## How I Built This — Step by Step

This project was built using **[Cursor AI](https://cursor.sh/)** (IDE with built-in AI) following a structured prompt-driven development workflow. Every component, utility, and page was built with deliberate, targeted prompts rather than asking the AI to generate everything at once.

### Phase 1 — Project Initialization

```bash
# 1. Scaffold the project using Vite + React template
npm create vite@latest trybetter-merchant-dashboard -- --template react
cd trybetter-merchant-dashboard

# 2. Install all dependencies
npm install react-router-dom recharts lucide-react clsx
npm install -D tailwindcss postcss autoprefixer gh-pages

# 3. Initialize Tailwind CSS
npx tailwindcss init -p
```

**Cursor prompt used for Tailwind config:**

> "Configure tailwind.config.js for a React Vite project. Add TryBetter brand colors: primary purple #7C3AED, hover purple #6D28D9, accent green #16A34A, light green #DCFCE7, light purple #F3F0FF, background #F8F7FF, card white, border #E5E7EB. Add Plus Jakarta Sans and Inter as font families."

---

### Phase 2 — Data Layer & Mock Data

Created three mock data files and processor rates configuration before writing a single UI component. **Data first, UI second** — this is the data analyst mindset.

**Files created:**

- `src/data/processorRates.js` — Fee structures for Stripe, Square, PayPal, TryBetter
- `src/data/mockTransactions.js` — 50 realistic transactions across 10 merchants
- `src/data/mockMerchants.js` — 12 merchant profiles with health scores and churn risk

**Cursor prompt used:**

> "Generate a JavaScript array of 50 mock payment transactions. Each transaction should have: id, date (last 90 days), amount ($10–$500), merchantName (10 real-sounding businesses from restaurant/retail/medical), category, status (completed 80% / refunded 10% / disputed 10%), paymentMethod (card/contactless/online/ach), processorFee (0 — TryBetter), hour (0–23), dayOfWeek (0–6)."

---

### Phase 3 — Data Engineering Pipeline

This is the core data engineering work. Four JavaScript modules were built to simulate a production ETL pipeline.

**Cursor prompt used for ETL processor:**

> "Build a JavaScript ETL pipeline module. Export: extractTransactions(rawData) that validates required fields and separates passed/failed records. transformTransactions(data) that normalizes dates to ISO, maps categories to business labels, calculates fee_saved as volume*0.029+0.30, and adds day_of_week, hour_of_day, is_weekend derived fields. loadTransactions(rawData) that runs both stages and returns data + pipeline_summary with record counts, run time, and status."

**Cursor prompt used for anomaly detector:**

> "Build a JavaScript anomaly detection module. Export: detectHighValueOutliers(transactions) using 2 standard deviations above mean. detectOffHoursActivity(transactions) flagging hours 23–5. detectVelocitySpikes(transactions) flagging merchants at 3x daily average. Each function returns an array with transactionId, merchant, amount, anomalyType, riskScore 0-100, and reason string."

**Cursor prompt used for stats engine:**

> "Write a statistical analysis module. Export: calculateDescriptiveStats(values) returning mean, median, std_dev, min, max, q25, q75, count. buildTimeSeriesData(transactions, months) returning last N months volume aggregated by month. calculateCorrelation(xArray, yArray) as Pearson correlation coefficient."

---

### Phase 4 — Utility Functions

```js
// src/utils/feeCalculator.js
// Core fee math — used by both the Calculator widget and Reports page
calculateFees(volume, avgTicket, processorKey)
calculateSavings(volume, avgTicket) // Returns all processor fees + maxSavings

// src/utils/formatters.js
formatCurrency(n)     // $1,234
formatCurrencyFull(n) // $1,234.56
formatVolume(n)       // $50K, $1.2M
formatDate(s)         // Apr 20, 2024
formatPercent(n)      // +12.4%
```

**Cursor prompt used:**

> "Write a feeCalculator.js utility. calculateFees(volume, avgTicket, processorKey) calculates monthly fees using rates from processorRates.js — transactions = round(volume/avgTicket), fee = (volume * percentageFee) + (transactions * flatFee). calculateSavings(volume, avgTicket) returns fees for all processors plus maxSavings and annualSavings. Round all values to 2 decimal places."

---

### Phase 5 — Layout & UI Components

Built the application shell before any page content.

**Cursor prompt used for Sidebar:**

> "Build a React sidebar for a payment analytics dashboard using TryBetter brand colors. White background, 1px right border #E5E7EB. TryBetter logo top with purple hex icon. Navigation links for Dashboard, Analytics, Data Pipeline, Savings Calculator, Transactions, Merchant Health, Reports using lucide-react icons. Active state: purple left border #7C3AED, purple text, light purple background #F3F0FF. Use react-router-dom NavLink."

**Cursor prompt used for StatCard:**

> "Build a React StatCard component. Props: title, value, change (number), changeLabel, icon, accentColor. White card, 1px border #E5E7EB, border-radius 14px, card-shadow. Colored icon circle top-right. Large value in Plus Jakarta Sans bold. Positive change = green arrow, negative = red arrow."

---

### Phase 6 — Chart Components

All charts use **Recharts** with TryBetter brand colors applied consistently.

**Cursor prompt used for Revenue Line Chart:**

> "Build a Recharts LineChart showing 6-month transaction volume. Dark theme: transparent background, grid lines #F3F4F6, axis text #9CA3AF, line color #7C3AED with gradient area fill from rgba(124,58,237,0.1) to transparent. Custom tooltip with white card style. Props: data array from buildTimeSeriesData."

**Cursor prompt used for Savings Bar Chart:**

> "Build a Recharts BarChart comparing monthly fees across Stripe, Square, PayPal, TryBetter for given volume and avgTicket. Calculate fees using feeCalculator. TryBetter bar green #16A34A, others in gray shades. Value labels above bars. White background, #F3F4F6 grid lines."

**Cursor prompt used for Transaction Heatmap:**

> "Build a transaction volume heatmap: day of week (rows) × hour of day (columns). Generate mock data with lunch (11am–2pm) and dinner (6pm–9pm) peaks on weekdays. Green color scale from rgba(124,58,237,0.05) to rgba(124,58,237,0.9). 28px cells. Day labels left, hour labels top every 3 hours."

---

### Phase 7 — Widgets

**Cursor prompt used for Savings Calculator widget:**

> "Build a React savings calculator. State: monthlyVolume slider 5000–500000, avgTicket slider 5–500, bizType selector with presets (Restaurant: $50K/$45, Retail: $80K/$75, Ecommerce: $120K/$95, Medical: $200K/$180). Show 3 result cards (Stripe, Square, TryBetter) with fees calculated live from feeCalculator.js. Large monthly savings amount. Annual breakdown table. Purple #7C3AED primary, green #16A34A for TryBetter winner card."

**Cursor prompt used for Merchant Health Score:**

> "Build a React merchant health card. Props: merchant object. SVG circular arc showing score 0–100. Green arc for 80+, yellow 60–79, orange 40–59, red below 40. Show: business name, category badge, monthly volume, avg ticket, churn risk badge. Card shadow, white background, 14px border-radius."

**Cursor prompt used for Chargeback Alert widget:**

> "Build a React chargeback alerts list. Show 5 transactions flagged by anomalyDetector.js with highest risk scores. Each row: merchant name, amount, risk level badge (High/Medium), anomaly type, Resolve button. Red left border accent on High Risk items. White card."

---

### Phase 8 — Pages

Each page follows the same pattern: import data → run pipeline/aggregation functions → pass results to chart and widget components.

**Cursor prompt used for Dashboard:**

> "Build the main Dashboard page. Grid layout: Row 1 — 4 StatCards (Total Volume, Active Merchants, Savings vs Stripe, Chargeback Rate). Row 2 — RevenueLineChart (2/3 width) + ProcessorPieChart (1/3). Row 3 — RecentTransactions (2/3) + ChargebackAlert (1/3). Row 4 — TransactionHeatmap full width. TryBetter brand colors throughout."

**Cursor prompt used for Data Pipeline page:**

> "Build a Data Pipeline Monitor page. Run loadTransactions from etlProcessor.js on mockTransactions data. Display: 4 stat cards (total records, passed, failed, run time). ETL flow diagram: 3 connected boxes EXTRACT → TRANSFORM → LOAD with counts and status. Data quality table per field (null count, type errors, status badge). Recent runs table with 5 mock entries showing timestamps, record counts, duration, and status."

**Cursor prompt used for Analytics page:**

> "Build Analytics page. Run calculateDescriptiveStats on transaction amounts from statsEngine.js. Display stats table (mean, median, std dev, quartiles). Run all three anomaly detection functions from anomalyDetector.js and show results in a table with Risk Score column. Run aggregateByCategory from aggregator.js and show horizontal bar chart. Show correlation between amount and hour with plain English interpretation."

---

### Phase 9 — Routing & App Entry

**Cursor prompt used:**

> "Build App.jsx for React Router v6. Routes: / → Dashboard, /analytics → Analytics, /pipeline → DataPipeline, /calculator → SavingsCalculator, /transactions → Transactions, /health → MerchantHealth, /reports → Reports. Wrap in BrowserRouter with Layout component. Import all pages."

---

### Phase 10 — Deploy to GitHub Pages

```bash
# Add gh-pages to package.json scripts
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

# Add base path in vite.config.js
base: '/trybetter-merchant-dashboard/'

# Initialize git and push
git init
git add .
git commit -m "feat: initial TryBetter merchant intelligence dashboard"
git remote add origin https://github.com/YOURUSERNAME/trybetter-merchant-dashboard.git
git push -u origin main

# Deploy to GitHub Pages
npm run deploy
```

---

## Getting Started Locally

```bash
# 1. Clone the repository
git clone https://github.com/YOURUSERNAME/trybetter-merchant-dashboard.git
cd trybetter-merchant-dashboard

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open in browser
# http://localhost:5173
```

**Requirements:** Node.js 18+ and npm 9+

---

## Brand Alignment

Every design decision maps directly to TryBetter's existing brand:


| Element        | TryBetter Brand                 | This Project                        |
| -------------- | ------------------------------- | ----------------------------------- |
| Primary color  | Purple (website CTAs, headings) | `#7C3AED` throughout                |
| Accent color   | Green (logo, highlights)        | `#16A34A` for savings/success       |
| Typography     | Bold heavy headings             | Plus Jakarta Sans 800 weight        |
| Tone           | "No BS fees", direct            | Clear data labels, no jargon        |
| Real merchants | Apna Bazar, A2B Restaurant      | Used as merchant names in mock data |


---

## Why This Project Matters for TryBetter

TryBetter currently has **no data layer visible to merchants or internal teams.** They claim on their website: *"Cutting Edge Dashboard — Get a 360° view of your business with smart analytics, real-time reports, and intuitive charts."* But this dashboard does not exist in a form merchants can interact with today.

This project delivers exactly that — built in their brand, using their actual merchant names, aligned to their actual business model. It can be integrated into their existing merchant portal by:

1. Replacing mock data sources with their real Clover/POS API data
2. Moving the pipeline functions to a Python or Node backend
3. Embedding the Savings Calculator as an iframe on their marketing site
4. Connecting the anomaly detection to their live transaction stream

---

## About This Project

Built by **Sathvik Putta** as a portfolio project targeting a Data Analyst / Data Engineering role at TryBetter (Better Payments). The project demonstrates:

- End-to-end data pipeline design (Extract, Transform, Load)
- Statistical analysis and anomaly detection on financial data
- Data visualization with business context
- Frontend implementation of data engineering concepts
- Deep research into TryBetter's actual product gaps and business model

**Tools used:** Cursor AI (IDE), React, Vite, Tailwind CSS, Recharts, Lucide React, GitHub Pages

---

*This is an independent portfolio project. It is not affiliated with or endorsed by TryBetter / Better Payments. All merchant data is fictional and used for demonstration purposes only.*
