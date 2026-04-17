`# ShiftSafeguard — Parametric Income Insurance for E-Commerce Delivery Partners
### Guidewire DEVTrails 2026 | Submission

---

## ⚡ The Evolution: From GigShield to ShiftSafeguard

> [!IMPORTANT]
> **Why we rebranded**: While *GigShield* was built to "shield" individual tasks, we realized that the true problem isn't just a missed delivery—it’s the lost **shift**. 
> 
> **ShiftSafeguard** reflects our broader, more proactive mission: safeguarding the entire livelihood of workers by protecting their most valuable asset—**time**. We don't just shield the gig; we safeguard the shift.

---

## 🏗️ System Architecture

![Architecture Diagram](./docs/Blank%20diagram%20-%20Page%201.svg)

The ShiftSafeguard engine is built for scale, balancing instant payouts with a layered adversarial defense. Here's how the "Arc" works:
1.  **Telemetry Ingestion**: Grabs a full stack of signal data (GPS, Sensor, Network).
2.  **Stage 1: Fast Path**: Redis-backed static rule engine filters known spoofers/emulators in milliseconds.
3.  **Stage 2: ML Pipeline & Voting**: Our democratic ensemble (Vision + NLP) adjudicates the core claim.
4.  **Green/Yellow Route**: Verified claims hit UPI instantly; suspicious ones trigger an in-app Step-Up Challenge (real-time video).

---

## 1. The Problem
Amazon Flex and Flipkart delivery partners are the last mile of India's infrastructure. They operate in unpredictable outdoor environments — extreme heat, heavy rain, floods, dense smog, curfews — with **no income protection**. 

A Zomato worker has platform visibility; an Amazon Flex partner has nothing. When a red-alert day wipes out their shift, they absorb 100% of the loss. 

**ShiftSafeguard insures the income lost during these events. Nothing else.**
- **Coverage scope**: LOSS OF INCOME ONLY.
- **Explicitly excluded**: Vehicle repairs, health insurance, accident medical bills.

---

## 2. Persona & Scenario Walkthrough
**Persona**: Ravi, 27. Amazon Flex delivery partner, Pune.  
Earns ₹600–800/day. Supports a family of 4.

### Scenario A — Extreme Heat Day
IMD issues a heat alert: temp > 43°C in Ravi's zone. Amazon Flex suspends outdoor deliveries. Ravi loses a full day's earnings.
- **ShiftSafeguard Response**: Weather API detects threshold breach; policy activates automatically (no claim needed); ₹500 payout hits his UPI in < 2 minutes.

### Scenario B — Flash Flood / Red Alert Rain
Heavy rainfall causes waterlogging. Deliveries suspended for 6 hours.
- **ShiftSafeguard Response**: Rain API confirms disruption; proportional payout issued; fraud layer cross-checks Ravi's GPS zone.

---

## 3. Weekly Premium Model
Gig workers operate week-to-week. Monthly models don’t fit their cash flow. ShiftSafeguard is priced and settled weekly.

| Plan | Weekly Premium | Max Weekly Payout | Coverage |
| :--- | :--- | :--- | :--- |
| **Basic Shield** | ₹29 | ₹500 | 1 disruption/week |
| **Standard Shield** | ₹59 | ₹1,200 | Up to 3 disruptions/week |
| **Pro Shield** | ₹99 | ₹2,000 | Unlimited disruptions/week |

**Dynamic Premium Calculation (AI Layer)**: Base premium is adjusted weekly using an **XGBoost** model:
- **Zone Risk Score**: Historical frequency in worker's delivery zone.
- **Seasonal Modifier**: Monsoon/Summer surcharge; Winter discount.
- **Tenure Discount**: Loyal workers with clean history get lower premiums.

---

## 4. The Brain: Two-Stage AI Pipeline

### Stage 1: Fast Path (Millisecond Filtering)
Redis-backed static rules check:
- **OS Mock Location Flag**: Catches simple GPS spoofers.
- **Emulator Signatures**: Blocks dev-tool driven attacks.
- **VPN Usage**: Detects IP/Location mismatches.

### Stage 2: Multimodal Ensemble (The "Vote")
Claims that pass Stage 1 enter our democratic adjudicator:
- **Visual Stream**: Vision model checks image integrity and pixel-level consistency.
- **Contextual NLP Stream**: Analyzes description keywords ("flood", "stuck", "closed") against live zone-disruption reports.
- **Probabilistic Fusion**: A 50/50 weighted vote resolve both streams into a confidence score (>85% for Green Route).

---

## 📈 Parametric Triggers
Triggers are automated, zone-specific, and requiring zero manual filing.

| Trigger | Data Source | Threshold | Payout Type |
| :--- | :--- | :--- | :--- |
| **Extreme Heat** | OpenWeatherMap / IMD | > 44.0 °C | Full Day |
| **Heavy Rain** | OpenWeatherMap / IMD | > 15.0 mm/hr | Proportional |
| **AQI (Pollution)** | CPCB / OpenWeather | > 300 (Very Poor) | Full Day |
| **Curfew / Strike** | Admin Flagged | Manual Trigger | Full Day |

---

## 🛠️ Tech Stack
- **Frontend**: Next.js 14, Tailwind CSS, Framer Motion.
- **Backend**: FastAPI (Python), Uvicorn.
- **ML Engine**: Python, XGBoost, Scikit-learn (DBSCAN + Behavioral Velocity).
- **Payments**: Razorpay Mock UPI Integration.

---

## 🏗️ Detailed Repository Structure
```text
ShiftSafeguard/
├── frontend/                     # Next.js 14 — worker app + admin dashboard
│   ├── app/
│   │   ├── (worker)/             # Worker-facing flows
│   │   │   ├── dashboard/        # Coverage & payouts
│   │   │   ├── onboarding/       # Registration & Aadhaar KYC
│   │   │   └── policy/           # Weekly plan selection
│   │   ├── (admin)/              # Admin-facing analytics
│   │   │   ├── dashboard/        # Loss ratios & fraud flags
│   │   │   └── zones/            # Zone/Manual trigger control
│   │   ├── layout.tsx
│   │   └── page.tsx              # Entry landing
│   ├── components/               # Custom UI (PolicyCard, PayoutStatus, etc.)
│   └── lib/                      # API Clients & Utilities
├── backend/                      # FastAPI Microservice — The AI Brain
│   ├── main.py                   # Orchestrator & entry point
│   ├── src/
│   │   ├── api/                  # Routes (Premium, Claims, Triggers)
│   │   ├── services/             # Core Logic (Ensemble AI, Fraud, Trigger)
│   │   ├── schemas/              # Pydantic data models
│   │   └── models/               # XGBoost binary binaries (.ubj)
│   ├── requirements.txt
│   └── .env.example
├── docs/                         # Technical Specs, Diagrams & PDF Reports
│   ├── Blank diagram - Page 1.svg# Master Architecture Visual
│   ├── adversarial-defense.pdf   # GPS Spoofing Defense Spec
│   └── Original_Project_Spec.md  # Foundational Phase 1 Doc
├── docker-compose.yml            # Deployment orchestration
└── README.md                     # This file
```

---

## 👨‍💻 Team ShiftSafeguard
Built with ❤️ by:
- **Aditya**
- **Palak Maurya**
- **Prathmesh Desai**

---
*ShiftSafeguard — Because the last mile shouldn't be the first to bear the loss.*
`