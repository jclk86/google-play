const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(morgan("common"));
const games = require("./games.js");

function changeCase(word) {
  let querySort= word.toLowerCase().replace(/^.{1}/g, word[0].toUpperCase())
  return querySort;
}

app.get("/apps", (req, res) => {
  const { sort, genres } = req.query;

  if(genres) {
    let genresCase = changeCase(genres)
    if(!["Action", "Puzzle", "Strategy", "Casual", "Arcade", "Card"].includes(genresCase)) {
      return res.status(400).send("Must be one of action, puzzle, strategy, casual, arcade, card")
    } else if (["Action", "Puzzle", "Strategy", "Casual", "Arcade", "Card"].includes(genresCase)) {
      let results = games.filter(game => {
        return game.Genres.includes(genresCase)
      })
      res.json(results)
    }
  }
 
  if(sort) {
    let sortCase = changeCase(sort);
    if (!["Rating", "App"].includes(sortCase)) {
    return res.status(400).send("Must be one of rating or app");
    } else if (sortCase === "Rating") {
      games.sort((a,b) => {
        return a[sortCase] > b[sortCase] ? -1 : a[sortCase] < b[sortCase] ? 1 : 0;
      })
    } else if(sortCase === "App") {
      games.sort((a,b) => {
        return a[sortCase] > b[sortCase] ? 1 : a[sortCase] < b[sortCase] ? -1 : 0;
      })
    }
  }
  res.json(games); 
});

app.listen(8000, () => {
  console.log("Express server is listening on port 8000!");
});
