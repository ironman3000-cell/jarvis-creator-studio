import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const tools = [
  { name: "YouTube Shorts", prompt: "Create a 25-second YouTube Short about Ben 10. Include a 1-second hook, scene-by-scene timing, on-screen text, transitions, and a strong ending." },
  { name: "Long-form video", prompt: "Create a 6-minute YouTube video plan about Ben 10 with a hook, structured sections, retention beats, and a closing CTA." },
  { name: "Titles & SEO", prompt: "Generate 10 clickable YouTube titles, a searchable description, relevant tags, and 3 thumbnail text ideas for a Ben 10 edit." },
  { name: "Weekly planner", prompt: "Build a realistic 7-day YouTube content calendar for a small channel focused on Ben 10 edits, Shorts, and audience growth. Include upload times in IST." },
  { name: "Community post", prompt: "Write an engaging YouTube Community poll for Ben 10 fans with four answer choices and a short intro." },
  { name: "WhatsApp promo", prompt: "Write a short WhatsApp message and Status caption promoting my newest Ben 10 YouTube Short. Keep it energetic and not spammy." }
];

function App() {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [listening, setListening] = useState(false);

  function useTool(item) { setPrompt(item.prompt); setError(""); document.getElementById("prompt")?.focus(); }
  async function generate(e) {
    e?.preventDefault();
    if (!prompt.trim() || busy) return;
    setBusy(true); setError(""); setAnswer("");
    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Request failed");
      setAnswer(data.text || "No response returned.");
    } catch (err) { setError(err.message || "Could not connect to JARVIS. Check your connection."); }
    finally { setBusy(false); }
  }
  function voiceInput() {
    const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Speech) { setError("Voice input isn't supported in this browser. Try Chrome on Android or type your request."); return; }
    const recognition = new Speech(); recognition.lang = "en-IN"; recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => { setListening(false); setError("Microphone access failed. Allow microphone permission in Chrome."); };
    recognition.onresult = (event) => setPrompt(p => (p ? p + " " : "") + event.results[0][0].transcript);
    recognition.start();
  }
  function speak() {
    if (!answer || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(answer));
  }
  return <main className="shell">
    <header className="top"><div className="brandmark">J</div><div><p className="eyebrow">PERSONAL AI SYSTEM</p><h1>JARVIS <span>CREATOR STUDIO</span></h1></div><div className="status"><i/> ONLINE UI</div></header>
    <section className="hero"><div className="orb"><span>J</span></div><p className="eyebrow">CREATOR CONSOLE / 001</p><h2>What are we creating today, Sir?</h2><p className="sub">Your content co-pilot for YouTube Shorts, long-form videos, SEO, and promotion.</p></section>
    <section className="section"><div className="sectionhead"><h3>QUICK TOOLS</h3><span>SELECT A WORKFLOW</span></div><div className="tools">{tools.map((t,i)=><button className="tool" key={t.name} onClick={()=>useTool(t)}><b>0{i+1}</b><span>{t.name}</span><strong>↗</strong></button>)}</div></section>
    <section className="section composer"><div className="sectionhead"><h3>COMMAND INPUT</h3><span>OPENAI POWERED</span></div><form onSubmit={generate}><label htmlFor="prompt">Your instruction</label><textarea id="prompt" value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Ask JARVIS to write a viral hook, plan an edit, or build a content calendar…" rows="5" maxLength="8000"/><div className="actions"><button type="button" className="secondary" onClick={voiceInput}>{listening ? "Listening…" : "🎙 Voice input"}</button><button type="submit" className="primary" disabled={busy || !prompt.trim()}>{busy ? "Generating…" : "Run command →"}</button></div></form>
    {error && <div className="error" role="alert">{error}</div>}
    {busy && <div className="loading"><i/> JARVIS is processing your request…</div>}
    {answer && <article className="answer"><div className="answerhead"><h3>JARVIS RESPONSE</h3><button className="secondary" onClick={speak}>🔊 Read aloud</button></div><div className="answertext">{answer}</div><button className="secondary" onClick={()=>navigator.clipboard?.writeText(answer).then(()=>setError("Response copied to clipboard.")).catch(()=>setError("Copy isn't available in this browser."))}>Copy response</button></article>}
    </section>
    <footer><span>JARVIS CREATOR STUDIO</span><span>Built for the next upload.</span></footer>
  </main>;
}

createRoot(document.getElementById("root")).render(<App />);