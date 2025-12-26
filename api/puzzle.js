// ==========================================
// TRTRSLF API — Puzzle Endpoint
// v2.10 — Stable, category-safe
// ==========================================

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  const puzzles = [
    {
      phrase: "LET THERE BE LIGHT",
      noVowels: "LT THR B LGHT",
      noSpaces: "LETTHEREBELIGHT",
      meta: {
        category: "biblical",
        source: "Genesis 1:3",
        clue: "Creation scene. Three famous words.",
        learn:
          "Well done! That line is associated with the opening creation narrative in Genesis.",
        nudge: "Think creation."
      }
    },

    {
      phrase: "MAY THE FORCE BE WITH YOU",
      noVowels: "MY TH FRC B WTH Y",
      noSpaces: "MAYTHEFORCEBEWITHYOU",
      meta: {
        category: "movies",
        source: "Star Wars",
        clue: "A blessing from a galaxy far away.",
        learn: "A classic line from Star Wars.",
        nudge: "Think Jedi."
      }
    }
  ];

  const { category } = req.query;

  // ✅ SAFE FILTERING
  const pool =
    !category || category === "all"
      ? puzzles
      : puzzles.filter(p => p.meta.category === category);

  const puzzle = pool[Math.floor(Math.random() * pool.length)];

  if (!puzzle) {
    return res.status(500).json({ error: "No puzzle available" });
  }

  res.status(200).json(puzzle);
}
