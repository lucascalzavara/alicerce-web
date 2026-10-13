# Alicerce Web

Frontend for Alicerce, a construction project management platform. The application is built with Vite, TypeScript, and Lit. Its interface is in Brazilian Portuguese, while source code and frontend routes use English names.

## Requirements

- Node.js and npm
- The Alicerce API running locally or at a reachable URL

## Getting started

Install dependencies and start the Vite development server:

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` to the API origin. For example:

```dotenv
VITE_API_BASE_URL=https://localhost:5001
```

In development, Vite proxies requests under `/api` to this origin. The frontend calls the authentication endpoints defined by the API, including first access, login, company selection, token refresh, and token revocation.

## Available scripts

```bash
npm run dev      # Start the development server
npm run build    # Type-check and create a production build
npm run preview  # Preview the production build locally
```

## Routes

| Route | Description |
| --- | --- |
| `/` | Public landing page |
| `/login` | User login |
| `/first-access` | Register a company and its initial administrator |
| `/select-company` | Choose a company when the user belongs to multiple companies |
| `/app` | Authenticated area (placeholder) |

## Brand assets

The `public/` directory contains the color and monochrome logo variants, with and without the Alicerce name. The color symbol is also used as the browser favicon.

A área /app agora inclui planos e obras. Limites e CSV são verificados pela API. Configure o Mercado Pago e execute scripts/002_plans_works.sql conforme Alicerce.Api/docs/plans-and-payments.md para habilitar cobranças. Apenas ADMIN gerencia os planos da empresa.
