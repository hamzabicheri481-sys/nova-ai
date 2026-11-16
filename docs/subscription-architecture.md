# NEXORA subscription architecture (design only)

**Status: planning document only.** This file does not enable accounts, trials, billing, ads, or access restrictions.

## Confirmed product requirements

- Trial target: 30 days.
- Paid plan target: USD 20 per month.
- A paying subscriber should use NEXORA without ads.

These requirements are not live product features.

## Decisions still open

Do not fill these gaps by assumption:

1. What happens when the 30-day trial ends and the user has not subscribed.
2. The exact event that starts the trial (for example, account verification or first successful use).
3. Whether a person can receive another trial.
4. Account sign-in method and identity provider.
5. Payment provider, merchant country eligibility, settlement currency/account, recurring-billing support and fees.
6. Tax treatment and how USD pricing is displayed/collected locally.
7. Whether any advertising is wanted and, if so, what counts as a verified completed ad view.

Until decision 1 is explicitly confirmed, do not implement checkout, ads, trial-expiry enforcement, or changes to access permissions.

## Current technical state

- The static site is in `index.html`.
- The Cloudflare Worker in `worker.js` currently exposes public `POST /chat` and `POST /analyze-image` routes.
- The Worker has no account identity, subscription lookup, verified trial state, payment webhook, or entitlement enforcement.
- The browser must not be trusted to report a user's plan, trial dates, payment status, or ad completion.
- The existing CORS origin check is not authentication and must not be treated as a subscription security boundary.

## Provider-neutral data model proposal (not created)

The following is a design sketch only; no database or provider has been selected.

### User

- `id`: internal immutable identifier
- `created_at`: server timestamp
- `auth_subject`: identifier from the selected authentication provider
- `email_verified_at`: optional server-verified timestamp

### Trial

- `user_id`
- `started_at`: server timestamp, populated only after the trial-start rule is approved
- `ends_at`: derived server-side as 30 days after `started_at`
- `status`: proposed values `not_started`, `active`, `ended_policy_pending`

The `ended_policy_pending` state is deliberately non-prescriptive: it records that the trial period has elapsed without deciding whether access should continue, require an ad, or stop.

### Subscription

- `user_id`
- `provider`
- `provider_customer_id`
- `provider_subscription_id`
- `status`: provider-mapped state, such as pending, active, past_due, canceled, or ended
- `current_period_start`
- `current_period_end`
- `cancel_at_period_end`
- `updated_at`

A paid entitlement must come only from a verified server-side provider event or a trusted provider API lookup, never from a browser-supplied value.

### Provider event ledger

- `provider_event_id` (unique)
- `event_type`
- `received_at`
- `signature_verified`
- `processed_at`
- `payload_hash`

Use a unique event identifier and transactional processing so duplicate webhook deliveries cannot grant duplicate periods or corrupt state. Store only the minimum event data needed for reconciliation and support.

## Server-side rules to implement only after decisions

1. Authenticate the user before reading or changing account-specific state.
2. Derive trial timestamps on the server from the approved trial-start event.
3. Verify webhook signatures against the raw request body using the provider's documented method.
4. Make webhook processing idempotent and reject invalid signatures.
5. Reconcile uncertain subscription states with the provider; do not infer payment from a redirect or a successful browser return.
6. Keep provider secrets in Cloudflare Worker secrets. Never commit them or expose them to the browser.
7. Grant ad-free status only for a verified paid subscription, subject to the final product policy.
8. Keep post-trial access in a pending, non-enforcing state until the user chooses the rule.

## Suggested API boundaries (not implemented)

- Auth endpoints: depend on the identity provider decision.
- Account status endpoint: return server-calculated trial/subscription status for the authenticated user.
- Checkout endpoint: create a provider checkout session server-side only after provider and product decisions.
- Webhook endpoint: verify provider signature, deduplicate event, update subscription record.
- Analysis endpoint: consult server-side entitlement only after the post-trial policy is approved.

Do not add a public `plan`, `isSubscribed`, `trialEndsAt`, or `adCompleted` request field as proof of entitlement.

## Required tests before launch

- Trial start timestamp is set once and uses server time.
- Trial end is calculated as exactly 30 days under the approved rule.
- Trial expiry does not silently apply an unapproved access policy.
- Valid webhook updates subscription state.
- Invalid webhook signature is rejected.
- Duplicate webhook is harmless.
- Payment failure, cancellation, refund and chargeback are reconciled.
- A user cannot read or alter another user's state.
- Client-side plan tampering cannot grant paid access.
- Paid users receive the agreed ad-free experience.
- Privacy notice, terms, support and refund handling are ready.

## Safe next step

Resolve the post-trial access rule and trial-start event first. Then select an authentication and payment architecture based on verified country, settlement and recurring-billing support. No live billing or permission changes should happen before those decisions and the required tests.
