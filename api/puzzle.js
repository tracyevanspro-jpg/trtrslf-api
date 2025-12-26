export default function handler(req, res) {
  // --- CORS (keep this) ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  // --- PUZZLE POOL ---
  const puzzles = [
    {
      phrase: "LET THERE BE LIGHT",
      noVowels: "LT THR B LGHT",
      noSpaces: "LETTHEREBELIGHT",
      meta: {
        category: "biblical",
        source: "Genesis 1:3",
        clue: "Creation scene. Three famous words.",
        learn: "Well done! This line opens the creation narrative in Genesis.",
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
        learn: "Correct. A defining line from Star Wars.",
        nudge: "Think sci-fi."
      }
    },
    {
      phrase: "I WILL BE BACK",
      noVowels: " WL B BCK",
      noSpaces: "IWILLBEBACK",
      meta: {
        category: "movies",
        source: "The Terminator",
        clue: "A promise that became iconic.",
        learn: "Correct. Arnold’s most quoted line.",
        nudge: "Think 1980s action."
      }
    }
  ];

  // --- OPTIONAL CATEGORY FILTER ---
  const { category } = req.query;
  const pool = category
    ? puzzles.filter(p => p.meta.category === category)
