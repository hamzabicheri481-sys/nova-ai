# NOVA AI

A mobile-friendly multilingual AI assistant published with GitHub Pages.

## Product direction
NOVA AI is a general-purpose AI assistant. Trading and chart analysis have been removed from the product.

Planned capabilities include:
- Multilingual AI chat
- Writing, rewriting and translation
- Learning and explanations
- Brainstorming and project planning
- Image-prompt creation
- Coding help and video-script drafting

## Secure AI backend (Cloudflare Worker + Gemini)

The backend code is in `worker.js`. It exposes:
- `POST /chat` for text-based NOVA AI responses.

Setup:
1. Create a Cloudflare account and open **Workers & Pages**.
2. Create a Worker and paste the complete contents of `worker.js`, then deploy it.
3. In Worker settings, add a secret named `GEMINI_API_KEY` using an API key created in Google AI Studio. Never put this secret in this repository, in `index.html`, or in a public message.
4. Copy the Worker URL. In `index.html`, set `NOVA_API_BASE` to that URL without a trailing slash.
5. Commit the change to `main`. GitHub Actions publishes the updated website.

The browser sends requests only to the Worker. The Gemini key remains server-side.

## Important launch limitations
The website does not yet have authentication, saved history, automatic 24-hour trial enforcement, subscription management, payment processing, or a tested live AI connection. Do not accept payments or promise an active free trial until these features are implemented and tested. Add privacy policy, terms, refunds and contact details before public launch.

## GitHub Pages
The workflow in `.github/workflows/deploy.yml` deploys the repository root to GitHub Pages whenever `main` changes. Check **Actions** and **Settings → Pages** for deployment status.
