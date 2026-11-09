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
- `POST /analyze-image` for chart screenshot reading (PNG, JPEG, WEBP; max 4 MB).

Setup:
1. Open Cloudflare **Workers & Pages**.
2. Deploy `worker.js` as the Worker named `nova-ai`. You can deploy manually from Cloudflare, or configure the optional GitHub Actions deployment below.
3. Add a Worker secret named `GEMINI_API_KEY` using a key created in Google AI Studio. Never put this secret in the repository, website HTML, or a public message.
4. The website currently calls `https://nova-ai.hamzabicheri481.workers.dev`, configured in `index.html`.

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


## Subscription system — planned, not active

### Confirmed commercial direction

- Free trial target: **30 days**.
- Paid plan target after the trial: **USD 20 per month**.
- A paying subscriber is intended to use NEXORA without ads.

These are product requirements only. They are **not implemented or available for purchase**. There is currently no account system, verified trial clock, subscription database, checkout, payment provider integration, webhook handling, cancellation flow, or server-side entitlement enforcement.

### Post-trial access policy — decision required

The access rule for a user whose 30-day trial ends without a paid subscription is **not yet confirmed**. Do not assume that this user should receive ad-supported access, be blocked automatically, or receive any particular number of free analyses.

Until the user explicitly confirms this policy, do not implement or activate:
- Payment or checkout.
- Advertising or rewarded-ad flows.
- Trial-expiry enforcement or changes to user permissions/access.
- Any user-facing claim that the trial or paid subscription is active.

### Other decisions still needed

- When the 30-day trial starts and whether it can be used more than once: **not decided**.
- Payment provider and settlement method: **not selected or verified**.
- Whether USD 20 includes applicable taxes/fees and how local-currency conversion is displayed: **not decided**.
- Account registration and login method: **not implemented**.

### Safe implementation sequence after decisions

1. Confirm the post-trial access rule and exact trial-start conditions.
2. Choose a payment provider that supports the business's country, currency, settlement and payout requirements; verify recurring billing, fees, refunds and chargebacks from official provider documentation.
3. Implement secure user accounts before tying a trial or paid entitlement to an individual.
4. Store trial start/end timestamps and subscription state server-side. Never trust a browser clock, local storage, or a client-supplied plan name to grant access.
5. Create checkout sessions server-side; keep secret keys in Cloudflare Worker secrets only.
6. Verify signed payment webhooks server-side and make webhook processing idempotent. Grant or revoke entitlements only from verified provider events.
7. Add cancellation, failed-payment handling, refunds, customer support, privacy notice and terms before launch.
8. Test trial expiry, successful payment, duplicate webhook, failed payment, cancellation, refund and unauthorized API access before enabling real payments.

Until the required decisions and implementation tests are complete, do not show an active checkout or claim that subscriptions are available.

### Optional automated Worker deployment

The repository includes `.github/workflows/deploy-worker.yml` and `wrangler.toml`. To enable manual deployment from GitHub Actions, add these two repository Actions secrets (never commit them):
- `CLOUDFLARE_API_TOKEN`: a Cloudflare API token with permission to edit/deploy Workers for this account.
- `CLOUDFLARE_ACCOUNT_ID`: the Cloudflare account ID.

Then open **GitHub → Actions → Deploy Cloudflare Worker → Run workflow**. The workflow is manual-only so it will not fail before the secrets are configured. The Gemini key remains a separate Cloudflare Worker secret named `GEMINI_API_KEY`.

The GitHub Pages workflow deploys the website only; it does not deploy the Worker. A successful Pages deployment does not prove the AI backend is deployed.
