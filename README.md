# NOVA AI

A mobile-friendly multilingual AI workspace published with GitHub Pages.

## Website status
- Responsive NOVA AI interface and browser-only text tools are included in `index.html`.
- The workspace can call a secure backend for live AI answers.
- The Trading Analyst can send a chart screenshot to the secure backend.
- Accounts, saved history, trial enforcement, subscriptions and payment processing are **not implemented**. Do not accept payments or promise automatic 24-hour trial enforcement until these are built and tested.

## Secure AI backend (Cloudflare Worker + Gemini)

The backend code is in `worker.js`. It exposes:
- `POST /chat` for text-based NOVA AI responses.
- `POST /analyze` for chart-image analysis.

Setup:
1. Create a Cloudflare account and open **Workers & Pages**.
2. Create a Worker and paste the complete contents of `worker.js`, then deploy it.
3. In the Worker settings, add a secret named `GEMINI_API_KEY` with an API key created in Google AI Studio. Do not put this secret in this repository, in `index.html`, or in a public message.
4. Copy the Worker URL. In `index.html`, set `NOVA_API_BASE` to that URL **without a trailing slash**.
5. Commit the change to `main`. GitHub Actions will publish the updated website.

The browser sends requests only to the Worker. The Gemini key remains on the server. The Worker allows requests only from this GitHub Pages site.

## GitHub Pages
The workflow in `.github/workflows/deploy.yml` deploys the repository root to GitHub Pages whenever `main` changes. Check **Actions** and **Settings → Pages** in GitHub for the deployment result and live URL.

## Before charging customers
Build and test secure authentication, server-side 24-hour trial enforcement, subscription status, usage limits, payment webhooks, privacy policy, terms, refunds and contact details. Never store secret keys in browser code. Chart analysis is educational and cannot guarantee a profitable trade.
