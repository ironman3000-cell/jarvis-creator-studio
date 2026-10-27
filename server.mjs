import express from "express";
import rateLimit from "express-rate-limit";
import OpenAI from "openai";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const port = process.env.PORT || 10000;
const root = path.dirname(fileURLToPath(import.meta.url));
app.set("trust proxy", 1);
app.use(express.json({ limit: "30kb" }));
app.use("/api/", rateLimit({ windowMs: 60_000, limit: 30, standardHeaders: true, legacyHeaders: false }));

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "JARVIS Creator Studio" }));

app.post("/api/chat", async (req, res) => {
  const prompt = typeof req.body?.prompt === "string" ? req.body.prompt.trim() : "";
  if (!prompt || prompt.length > 8000) return res.status(400).json({ error: "Enter a prompt of up to 8,000 characters." });
  if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: "OpenAI API key is not configured. Add OPENAI_API_KEY in Render Environment." });
  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      instructions: "You are JARVIS, a precise and helpful mobile-first YouTube content production assistant. Help create Shorts scripts, long-form outlines, hooks, titles, descriptions, SEO tags, publishing plans, community posts, and WhatsApp promotions. Be practical and clearly label suggestions.",
      input: prompt,
      max_output_tokens: 1200
    });
    res.json({ text: response.output_text || "I couldn't generate a response. Please try again." });
  } catch (error) {
    console.error("OpenAI request failed:", error?.status || error?.message || "unknown error");
    const status = error?.status === 401 ? 502 : 502;
    res.status(status).json({ error: error?.status === 401 ? "OpenAI rejected the API key. Check OPENAI_API_KEY in Render." : "The AI request failed. Check your API key, model access, and billing, then try again." });
  }
});

app.use(express.static(path.join(root, "dist"), { maxAge: "1h" }));
app.get("*", (_req, res) => res.sendFile(path.join(root, "dist", "index.html")));
app.listen(port, "0.0.0.0", () => console.log(`JARVIS Creator Studio listening on ${port}`));