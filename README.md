# NOVA AI

A mobile-friendly starter website for a multilingual AI workspace.

## Current status
- Static landing page and responsive interface are included in `index.html`.
- The tool selector and preview interactions work in the browser.
- **AI generation, user accounts, saved history, credit accounting, subscriptions and payments are not implemented yet.** Do not advertise these as live features or accept payments until they are built and tested.

## Publish with GitHub Pages
1. In the repository, open **Settings → Pages**.
2. Under **Build and deployment**, choose **GitHub Actions** as the source.
3. Push to `main` or run the **Deploy NOVA AI to GitHub Pages** workflow manually.
4. GitHub will show the live URL under Settings → Pages after a successful deployment.

## Before monetization
A secure server-side backend is required for AI provider keys, authentication, usage limits, credit balances and payment webhooks. Never put secret API keys in browser JavaScript. Add privacy, terms, refund and contact information before accepting customers.


## NOVA Trading Analyst backend setup

The chart-analysis interface calls a separate Cloudflare Worker so the Gemini API key is never exposed in the public GitHub Pages site.

1. Create a Cloudflare Worker and paste the contents of `worker.js` into its editor, then deploy it.
2. In the Worker settings, add a secret named `GEMINI_API_KEY` containing your key from Google AI Studio. Never put this key in `index.html`, GitHub files, or public messages.
3. Copy the deployed Worker URL.
4. In `index.html`, set `NOVA_TRADING_API` to that Worker URL, commit the change, and wait for GitHub Pages to redeploy.

Until these steps are complete, the Trading Analyst UI is present but live AI analysis is not active. Gemini can accept image input through its generateContent API. Chart analysis is educational only and must not be treated as a guaranteed trading signal.
