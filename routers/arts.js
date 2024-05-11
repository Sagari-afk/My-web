const express = require("express");
const router = express.Router();
const dbHandler = require("../utils/dbHandler");

router.get("/arts", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).render("401");
    }
    // await dbHandler.init(); // Uz bolo spustene
    await dbHandler.updateArts();
    const allArts = await dbHandler.getAllArts();

    let arts;
    if (req.query.search) {
      // Filter posts by key word containing the search keyword
      arts = await dbHandler.getArtsByKeyWord(req.query.search);
      console.log("mnau2");
    } else {
      // Get all posts if no search keyword is provided
      arts = allArts;
    }

    return res.render("arts", {
      arts: arts,
      allArts: allArts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).render("500");
  }
});

router.get("/getArts/search=:search", async (req, res) => {
  try {
    const allArts = await dbHandler.getAllArts();
    const query = req.params.search;

    let arts;
    if (query && query != "all") {
      // Filter posts by key word containing the search keyword
      arts = await dbHandler.getArtsByKeyWord(query);
    } else if (query == "all") {
      // Get all posts if no search keyword is provided
      arts = allArts;
    }

    return res.json(arts);
  } catch (error) {
    console.log(error);
    res.status(500).render("500");
  }
});

router.post("/arts", async (req, res) => {
  try {
    let { id, like } = req.body;
    console.log(id, like);
    if (like) dbHandler.likeById(id);
    else dbHandler.dislikeById(id);
    const likeCount = await dbHandler.getLikesCountById(id);
    return res.status(201).json(likeCount);
  } catch (error) {
    console.log(error);
    res.status(500).render("500");
  }
});
module.exports = router;
