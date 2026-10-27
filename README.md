# JARVIS Creator Studio

Mobile-first OpenAI-powered content assistant for YouTube creators. Includes prompt workflows for Shorts, long-form outlines, SEO metadata, weekly content planning, Community posts, and WhatsApp promotions.

## Deploy on Render

1. Create a Render Blueprint from this repository and select the `main` branch.
2. Blueprint path: `render.yaml` (repository root).
3. Add the secret environment variable `OPENAI_API_KEY` in Render. Never commit API keys.
4. Deploy. Render runs `npm install && npm run build`, then `npm start`.
5. Open the HTTPS `onrender.com` URL in Chrome on your phone.

## Local development

- Node.js 20 or newer recommended.
- `npm install`
- Set `OPENAI_API_KEY` in your environment.
- `npm run dev` for the Vite development server, or `npm run build && npm start` to run the production app.

## API

- `GET /api/health` returns service health.
- `POST /api/chat` accepts JSON `{"prompt":"..."}` and returns generated text.

The OpenAI key is read only on the server. The browser never receives it. API requests are rate-limited and prompt length is capped.

## Notes

Voice input uses the browser Speech Recognition API where supported; read-aloud uses browser speech synthesis. AI usage may incur OpenAI API charges.