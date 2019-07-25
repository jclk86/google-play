const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(morgan("common"));
const games = require("./games.js");

app.get("/apps", (req, res) => {
  let { sort, genres } = req.query;

  if (sort) {
    sort.toLowerCase().replace(/^.{1}/g, sort[0].toUpperCase());
    if (!["Rating", "App"].includes(sort)) {
      return res.status(400).send("Must be one of rating or app");
    }
  }

  if (!sort) {
    return res.json(games); // change for genres .filter it
  }

  if (sort === "Rating") {
    games.sort((a, b) => {
      return a[sort] > b[sort] ? -1 : a[sort] < b[sort] ? 1 : 0;
    });
  }

  if (sort === "App") {
    games.sort((a, b) => {
      return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
    });
  }
  // if (!genres) {
  //   res.json(games);
  // }
  // if (genres) {
  //   if (!["Action", "Puzzle", "Strategy", "Casual", "Arcade", "Card"].includes(genres)) {
  //     return res
  //       .status(400)
  //       .send(
  //         "Must choose one of action, puzzle, strategy, casual, arcade, or card"
  //       );
  //   }
  // }

  res.json(games);
});

app.listen(8000, () => {
  console.log("Express server is listening on port 8000!");
});
