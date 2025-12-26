export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  res.status(200).json({
    phrase: "LET THERE BE LIGHT",
    noVowels: "LT THR B LGHT",
    noSpaces: "LETTHEREBELIGHT",
    meta: {
      source: "Genesis 1:3",
      clue: "Creation scene. Three famous words.",
      learn: "Well done! That line is associated with the opening creation narrative in Genesis.",
      nudge: "Think creation.",
      hint2: "Try the vowels hint."
    }
  });
}
