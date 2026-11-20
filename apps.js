// Edit this list to change what the carousel shows.
// The apps below are placeholders: replace the names, copy, URLs and images with your own.
//
//   name        Large headline on the slide
//   tagline     One-line summary under the name
//   description One or two sentences of detail
//   cta         Button label (defaults to "Open <name>")
//   url         Where the button goes (opens in a new tab)
//   image       Hero image path. Any JPG, PNG, WebP or SVG works; landscape, at least 1600x1000, works best.
//   imageAlt    Describe the image, or leave empty if it is decoration
//   background  Slide color shown behind and blended into the image
//   accent      Button color (dark text sits on top, so pick a light or bright color)

const APPS = [
  {
    name: "Gospel Word Search",
    tagline: "Find hidden words in Gospel themed puzzles",
    description: "Challenge your brain with this fun and educational word search game.",
    cta: "Play Gospel Word Search",
    url: "games/GospelWordSearch.html",
    image: "images/wordsearch.png",
    imageAlt: "A grid of letters with some words highlighted",
    background: "#2c3e50",
    accent: "#f39c12",
    tags: ["puzzle", "words", "search"]
  },
  {
    name: "Pioneer Quest",
    tagline: "Answer trivia questions about Church history",
    description: "",
    cta: "Play Pioneer Quest",
    url: "games/PioneerQuest.html",
    image: "images/quest.png",
    imageAlt: "",
    background: "#6b4e2e",
    accent: "#d9a441",
    tags: [],
  },
  {
    name: "Temple Photo Puzzle",
    tagline: "A fun picture puzzle game",
    description: "Unshuffle the pieces of a picture to arrange them to complete the image.",
    cta: "Play Picture Shuffle",
    url: "games/PictureShuffle.html",
    image: "images/pictureshuffle.png",
    imageAlt: "A jumbled picture with pieces out of order",
    background: "#1a2e2e",
    accent: "#1abc9c",
    tags: ["photo", "logic", "image", "order"]
  },
  {
    name: "Gospel Crossword",
    tagline: "Solve crossword puzzles of varying difficulty",
    description: "Challenge yourself with a variety of crossword puzzles.",
    cta: "Play Crosswords",
    url: "games/Crosswords.html",
    image: "images/crosswords.png",
    imageAlt: "A partially filled crossword puzzle grid",
    background: "#2e1a2e",
    accent: "#9b59b6",
    tags: ["puzzle", "words", "crossword"]
  },
  {
    name: "Gospel Letter Scramble",
    tagline: "tag line",
    description: "description",
    cta: "Play game",
    url: "games/WordScramble.html",
    image: "images/game.png",
    imageAlt: "alt tag",
    background: "#17382c",
    accent: "#e8d26a",
    tags: ["puzzle", "logic", "lights"]
  },
  {
    name: "Scripture Books",
    tagline: "tag line",
    description: "description",
    cta: "Play game",
    url: "games/StandardWorks.html",
    image: "images/game.png",
    imageAlt: "alt tag",

    background: "#4a3f2b",
    accent: "#d35400",
    tags: ["action", "strategy", "maze"]
  },
  {
    name: "Jigsaw",
    tagline: "tag line",
    description: "description",
    cta: "Play game",
    url: "games/Jigsaws.html",
    image: "images/game.png",
    imageAlt: "alt tag",

    background: "#1a1a2e",
    accent: "#00bcd4",
    tags: ["adventure", "exploration", "space"]
  },
].reverse(); // Show the most recently added apps first
