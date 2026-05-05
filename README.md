# 🇸🇦 KSA Accessibility Auditor

> **Premium School Accessibility Auditing Platform**
> Built with technical precision and visual excellence.

KSA Accessibility is a state-of-the-art mobile-first platform designed to streamline the process of auditing and reporting accessibility standards in schools across the Kingdom of Saudi Arabia. It provides a seamless experience for auditors to document findings, assess severity, and track improvements with a human-centric approach.

---

## ✨ Visual Excellence
- **Glassmorphic UI**: Modern aesthetic with blurred backgrounds and sleek borders.
- **Micro-Animations**: Smooth transitions powered by CSS and Vue.
- **Typography**: Optimized for readability using modern sans-serif fonts.
- **Responsive**: Native-app feel on mobile devices with optimized layout constraints.
## 🚀 Key Features
- **Intuitive Onboarding**: A simplified, human-centric flow to get auditors started quickly.
- **Dynamic Dashboard**: Centralized view for managing accessibility reports and school audits.
- **Severity Assessment**: Standardized assessment terminology for consistent reporting.
- **Real-time Feed**: High-quality audit feed with image support for visual documentation.
- **Local Persistence**: User state management with localStorage for a seamless return experience.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: [Vue 3](https://vuejs.org/) (Composition API)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Icons**: [Lucide Vue Next](https://lucide.dev/)
- **Styling**: Vanilla CSS with modern Design Tokens

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: SQL (MySQL)
- **Process Management**: [PM2](https://pm2.keymetrics.io/)
- **Tunneling**: [Cloudflared](https://github.com/cloudflare/cloudflared)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MySQL Server
- Cloudflared (for production tunneling)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jkmanyeEx/ksaaccessibility.git
   cd ksaaccessibility
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Environment Setup**
   Create a `.env` file in the `server` directory:
   ```env
   PORT=3101
   SQL_USER=devmeko
   SQL_PW=Qqqq1111!
   DB_NAME=ksaaccessibility
   ```

### Running Locally

To start both the client and server in development mode:
```bash
npm run dev
```
- **Frontend**: http://localhost:3100
- **Backend**: http://localhost:3101

---

## 🏗 Infrastructure & Deployment

### PM2 Integration
The project is configured for process management via `ecosystem.config.js`. To start the production services:
```bash
pm2 start ecosystem.config.js
```

### Cloudflare Tunneling
Mapped URLs:
- **Frontend**: `appname.devmeko.xyz`
- **Backend**: `appnameapi.devmeko.xyz`

---

## 🛡 Security & Best Practices
- **Root Cause Analysis**: Every fix is preceded by thorough investigation.
- **Verification Obsession**: Automated tests and manual walkthroughs ensure stability.
- **Infrastructure Automation**: Mandatory PM2 and Cloudflared enrollment for all production services.

---

**Built by Antigravity** — *High-performance, premium-grade software.*
