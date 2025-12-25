export default async function handler(req, res) {
  const category = (req.query.category || "biblical").toString();

  // NOTE:
  // - For “biblical” we can safely use short KJV-style phrases.
  // - For movies/songs/etc: we generate ORIGINAL “-ish” lines (not copyrighted quotes/lyrics).

  const system = `
You generate short puzzle phrases for a word game.
Output STRICT JSON only.
Rules:
- phrase: ALL CAPS, normal WORD SPACES (e.g., "LET THERE BE LIGHT")
- meta.source: short source label (e.g., "Genesis 1:3" or "Movie-ish, 1990s action vibe")
- meta.clue: ONE short hint sentence (not the answer)
- meta.learn: ONE short educational payoff line like: "Well done! That line is associated with…"
- Keep phrase 2–6 words.
- For non-biblical categories: DO NOT use real copyrighted quotes or song lyrics. Make original lines that feel like the category.
JSON shape:
{"phrase":"...","meta":{"source":"...","clue":"...","learn":"...","nudge":"...","hint2":"..."}}
`;

  const user = `Category: ${category}
Return one puzzle.`;

  try {
    // If you haven't set OPENAI_API_KEY in Vercel yet, this will fail.
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      // fallback so the site still works
      return res.status(200).json(makePuzzleFromPhrase("LET THERE BE LIGHT", {
        source: "Genesis 1:3",
        clue: "Creation scene. Three famous words.",
        learn: "Well done! That line is associated with the opening creation narrative in Genesis.",
        nudge: "Think creation.",
        hint2: "Try the vowels hint.",
      }));
    }

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          { role: "system", content: system },
          { role: "user", content: user }
        ],
        temperature: 0.9
      }),
    });

    if (!r.ok) throw new Error(`OpenAI error: ${r.status}`);
    const data = await r.json();

    // Responses API returns text in output[0].content[0].text (commonly)
    const text = data.output?.[0]?.content?.[0]?.text || "";
    const obj = JSON.parse(text);

    const phrase = sanitizePhrase(obj.phrase || "");
    const meta = obj.meta || {};

    return res.status(200).json(makePuzzleFromPhrase(phrase, meta));
  } catch (e) {
    // fallback
    return res.status(200).json(makePuzzleFromPhrase("IN THE BEGINNING", {
      source: "Genesis 1:1",
      clue: "The opening words of the Bible.",
      learn: "Well done! That line is associated with the opening of Genesis.",
      nudge: "Think: first words.",
      hint2: "Try spaces first, then vowels."
    }));
  }
}

function sanitizePhrase(s) {
  return String(s)
    .toUpperCase()
    .replace(/[^A-Z\s]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

function removeVowelsKeepWordSpaces(phrase) {
  // Remove vowels from each word, keep the word boundaries (spaces).
  return phrase
    .split(" ")
    .map(w => w.replace(/[AEIOU]/g, ""))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function makePuzzleFromPhrase(phrase, meta) {
  const clean = sanitizePhrase(phrase);
  return {
    phrase: clean, // ALL CAPS, with word spaces
    noVowels: removeVowelsKeepWordSpaces(clean), // ALL CAPS, word spaces only
    noSpaces: clean.replace(/\s/g, ""), // ALL CAPS, no spaces
    meta: {
      category: meta.category || undefined,
      source: meta.source || "",
      clue: meta.clue || "",
      learn: meta.learn || "",
      nudge: meta.nudge || "Try a hint.",
      hint2: meta.hint2 || "Try spaces, then vowels."
    }
  };
}
