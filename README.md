# NEXORA — AI Market Intelligence

NEXORA is an Arabic-first, mobile-friendly market education and technical-analysis interface. The current public site is deployed through GitHub Pages.

## Current website features

- Arabic, mobile-first trading analysis interface
- TradingView embedded chart with selectable symbols: XAU/USD, EUR/USD, GBP/USD and BTC/USDT
- AI-assisted educational analysis based on user-entered market notes
- Basic account-risk calculator
- Risk, privacy and product disclaimers

## Deployment

The workflow in `.github/workflows/deploy.yml` deploys the repository root to GitHub Pages whenever `main` changes. Check **Actions** and **Settings → Pages** for deployment status.

Current Pages URL: https://hamzabicheri481-sys.github.io/nova-ai/

## AI backend (Cloudflare Worker + Gemini)

The backend code is in `worker.js`. It exposes:
- `POST /chat` for text-based AI responses.

Setup:
1. Open Cloudflare **Workers & Pages**.
2. Deploy the complete contents of `worker.js` to the Worker.
3. Add a Worker secret named `GEMINI_API_KEY` using a key created in Google AI Studio. Never put this secret in the repository, website HTML, or a public message.
4. The website currently calls the existing Worker URL configured in `index.html`.

The browser sends requests only to the Worker. The Gemini key remains server-side.

## Important product limitations

- The AI analysis uses only the information typed by the visitor. It does not independently fetch live market prices or news.
- Chart prices and availability are provided by the embedded TradingView widget and may be delayed or subject to provider conditions.
- Uploading chart screenshots, user accounts, saved analysis history, payment processing, paid subscriptions and automated trial enforcement are not implemented.
- The risk calculator is a simple educational calculation, not a position-sizing recommendation.
- Do not accept payments or advertise paid features as active until payment, account, privacy, terms and support workflows are implemented and tested.
- NEXORA provides general educational information, not personalized investment advice or guaranteed trade signals. Check licensing and regulatory requirements before offering regulated investment recommendations in any target country.

## Security

Never commit API keys, passwords, account credentials or private tokens. Keep provider secrets in Cloudflare Worker secrets.
