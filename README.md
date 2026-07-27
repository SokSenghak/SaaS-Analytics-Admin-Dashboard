# Lumaora — SaaS Analytics & Admin Dashboard

Lumaora is a high-end, responsive, and performance-optimized full-stack administrative platform. It combines real-time system monitoring, microservice telemetry tracking, interactive user CRM management, API configuration, webhooks integration, ecommerce store controls, and deep, server-side AI-powered analytical diagnostics.

The application leverages a unified **Express + React (Vite)** architecture, styled with tailwind CSS utilities, and uses standard web platform protocols with clean typography, negative space, and smooth layout entry transitions.

---

## 🚀 Application Workflows

Lumaora is engineered around a series of key functional workflows tailored to SaaS administrators and DevOps managers:

1. **Telemetry & System Health Tracking**
   - Monitors key metrics such as MRR (Monthly Recurring Revenue), active users, API latency, and global server load.
   - Interactive, regional telemetry map allows admins to inspect server latency, localized connections, and nodes status (Healthy, Degraded, Critical).

2. **User Management & CRM Workspace**
   - Provides a comprehensive overview of active tenant nodes, complete with metadata (user name, email, company, and signup date).
   - Allows operations teams to dynamically adjust access tiers (Enterprise, Pro, Free), suspend malicious nodes, or provision new user profiles.

3. **API Credentials & Security**
   - Self-service console for provisioning custom API access tokens.
   - Credentials are generated with specific permission scopes (`Read-Only`, `Admin`, `Full-Access`) and prefix masking.
   - Suspicious keys can be instantly revoked to prevent unauthorized access.

4. **Webhooks Infrastructure**
   - Webhooks gateway allowing third-party application integration.
   - Admins configure destination URLs and specify events (`user.created`, `user.deleted`, `billing.succeeded`, etc.) to stream state changes.

5. **E-Commerce Operations Console**
   - **Products Catalog**: Tracks unit pricing, total sold, real-time inventory, and product categories.
   - **Orders Management**: Order lifecycle dashboard including payment value, delivery status, and tracking dates.
   - **Campaigns & Marketing ROI**: Monitors budgets, generated revenues, and Click-Through-Rates (CTR) to evaluate acquisition strategies.
   - **Discounts & Coupons**: Tracks custom voucher codes, discount levels, and total redemption counts.

6. **Unified Support Inbox**
   - Centrally collects system-wide support inquiries, order corrections, and marketing proposals.
   - Supports active ticket assignment, filtering, status resolution, and inline draft responding.

7. **Aetheris AI Insights Engine**
   - Server-side integration with **Gemini models** to evaluate system health or run security audits.
   - Offers rapid analysis for anomalies (e.g., detecting cold starts, DDoS patterns), latency-shaving strategies, and direct answers to administrative queries.

---

## 🛠️ System Architecture & Flow

Lumaora uses a full-stack, single-container architecture designed for rapid build verification and absolute security.

### 1. Unified Client-Server Runtime
In development, the backend **Express** server boots first and mounts a hot-rebuild friendly **Vite dev server** as a middleware. This enables single-port serving on `3000` with instant static routing. In production, Vite compiles static bundles into the `/dist` directory, and the Express server serves them statically.

```
       +---------------------------------------------+
       |             Client Browser                  |
       +---------------------------------------------+
                              |
                     HTTP/REST /api/*
                              v
       +---------------------------------------------+
       |               Express Server                |
       |  - API Routing (/api/ai/insights)           |
       |  - Server-Side Gemini SDK Orchestration    |
       |  - Static Asset Delivery (Vite Integration) |
       +---------------------------------------------+
                              |
                       gRPC (TLS 1.3)
                              v
       +---------------------------------------------+
       |              Google Gemini API              |
       |          (Models: gemini-3.6-flash)        |
       +---------------------------------------------+
```

### 2. High-Performance Build Pipeline
To bypass typical Node.js CommonJS/ESM conflict bottlenecks, the production build compiles the server using `esbuild`. 
- **Server Bundle Output**: `dist/server.cjs`
- **Frontend Assets Output**: `dist/*` (statically served by the server node)
- **Advantages**: Solves ES module relative-path resolution problems at build-time, injects server sourcemaps, and delivers incredibly fast container start times.

---

## 📦 Scripts & Commands

Manage the application workspace using these core scripts:

| Command | Action | Implementation |
| :--- | :--- | :--- |
| `npm run dev` | **Start Dev Environment** | Runs `tsx server.ts` to boot the Express backend with live Vite client middleware on http://localhost:3000. |
| `npm run build` | **Compile Production Target** | Runs `vite build` for client code, then uses `esbuild` to package `server.ts` into a self-contained `dist/server.cjs` bundle. |
| `npm run start` | **Run Production Bundle** | Launches the compiled production application using `node dist/server.cjs`. |
| `npm run lint` | **Validate TypeScript Code** | Performs a strict compiler type-check (`tsc --noEmit`) to verify safety. |
| `npm run clean` | **Prune Dist Artifacts** | Safely removes old build directories (`/dist` and other temporary assets). |

---

## ⚙️ Environment Variables

Define these variables in your root environment configuration:

- `GEMINI_API_KEY`: **[Required]** The server-side API credential used by the Aetheris Engine to interface with Gemini's models. This is never exposed to the client browser.
- `PORT`: (Injected automatically by infrastructure) Defaults to `3000`. Do not modify, as all reverse proxy layers point here.
