export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const puzzle = {
    phrase: "LET THERE BE LIGHT",
    noVowels: "LT THR B LGHT",
    noSpaces: "LETTHEREBELIGHT",
    meta: {
      source: "Genesis 1:3",
      category: "biblical"
    }
  };

  res.status(200).json(puzzle);
}
