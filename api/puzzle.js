// ================================
// TRTRSLF — Puzzle API (AI-driven)
// Layer: API ONLY
// UI + Game Logic are LOCKED
// ================================

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ---------- Utility helpers ----------
function stripVowels(str) {
  return str.replace(/[AEIOU]/gi, "");
}

function stripSpaces(str) {
  return str.replace(/\s+/g, "");
}

// ---------- Prompt builder ----------
function buildPrompt(category) {
  return `
You are generating a short, well-known phrase for a word puzzle game.

Category: ${category}

Rules:
- Phrase must be 2–6 words
- Widely recognizable
- No profanity
- No copyrighted lyrics longer than a short quote

Return ONLY valid JSON in this exact format:

{
  "phrase": "FULL PHRASE IN CAPS",
  "meta": {
    "source": "Where it comes from",
    "clue": "A subtle hint",
    "learn": "A brief educational sentence",
    "nudge": "A gentle hint if the player is wrong"
  }
}
`;
}

// ---------- Main handler ----------
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const category = req.query.category || "biblical";

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [
        { role: "system", content: "You generate structured puzzle data." },
        { role: "user", content: buildPrompt(category) }
      ]
    });

    const raw = completion.choices[0].message.content;
    const parsed = JSON.parse(raw);

    const phrase = parsed.phrase.toUpperCase();

    // ---------- Final API response ----------
    res.status(200).json({
      phrase,
      noVowels: stripVowels(phrase),
      noSpaces: stripSpaces(phrase),
      meta: parsed.meta
    });

  } catch (err) {
    // ---------- SAFETY FALLBACK (never break UI) ----------
    res.status(200).json({
      phrase: "LET THERE BE LIGHT",
      noVowels: "LT THR B LGHT",
      noSpaces: "LETTHEREBELIGHT",
      meta: {
        source: "Genesis 1:3",
        clue: "Creation scene. Three famous words.",
        learn: "This line opens the biblical creation narrative.",
        nudge: "Think creation."
      }
    });
  }
}
