const PUZZLES = {
  biblical: [
    { phrase: "IN THE BEGINNING", source: "Genesis 1:1" },
    { phrase: "LET THERE BE LIGHT", source: "Genesis 1:3" }
  ],
  movies: [
    { phrase: "MAY THE FORCE BE WITH YOU", source: "Star Wars" },
    { phrase: "HERE IS LOOKING AT YOU KID", source: "Casablanca" }
  ],
  pop: [
    { phrase: "JUST DO IT", source: "Nike" },
    { phrase: "I WANT MY MTV", source: "MTV" }
  ],
  songs: [
    { phrase: "IMAGINE ALL THE PEOPLE", source: "John Lennon" },
    { phrase: "WE WILL ROCK YOU", source: "Queen" }
  ]
};

function stripVowels(str) {
  return str.replace(/[AEIOU]/gi, "");
}

function stripSpaces(str) {
  return str.replace(/\s+/g, "");
}

export default function handler(req, res) {
  const category = (req.query.category || "biblical").toLowerCase();
  const list = PUZZLES[category] || PUZZLES.biblical;
  const item = list[Math.floor(Math.random() * list.length)];

  res.status(200).json({
    phrase: item.phrase,
    noVowels: stripVowels(item.phrase),
    noSpaces: stripSpaces(item.phrase),
    meta: {
      source: item.source,
      category
    }
  });
}
