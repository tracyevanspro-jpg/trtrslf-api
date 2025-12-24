export default function handler(req, res) {
  res.status(200).json({
    phrase: "IN THE BEGINNING",
    noVowels: "N TH BGNNNG",
    noSpaces: "INTHEBEGINNING",
    meta: {
      source: "Genesis 1:1",
      genre: "Biblical 2"
    }
  });
}
