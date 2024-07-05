const express = require("express");
const router = express.Router();
const dbHandler = require("../utils/dbHandler");

router.get("/arts", async (req, res) => {
  try {
    // if (!req.session.user) {
    //   return res.status(401).render("401");
    // }
    await dbHandler.init(); // Uz bolo spustene

    await dbHandler.updateArts();
    // await dbHandler.updateLinksOnArts();
    const allArts = await dbHandler.getAllArts();

    let arts;
    if (req.query.search) {
      // Filter posts by key word containing the search keyword
      arts = await dbHandler.getArtsByKeyWord(req.query.search);
    } else {
      // Get all posts if no search keyword is provided
      arts = allArts;
    }
    arts.sort((a, b) => b.date - a.date);

    return res.render("arts", {
      arts: arts,
      allArts: allArts,
      user_id:  res.locals.user,
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
    arts.sort((a, b) => b.date - a.date);

    return res.json(arts);
  } catch (error) {
    console.log(error);
    res.status(500).render("500");
  }
});

router.get("/isLiked/:art_id/:user_id", async (req, res) => {
  try {
    const art_id = req.params.art_id;
    const user_id = req.params.user_id;
    const isLiked = await dbHandler.isLiked(art_id, user_id);
    return res.json({ isLiked });
  } catch (error) {
    console.log(error);
    res.status(500).render("500");
  }
});

router.post("/arts", async (req, res) => {
  try {
    let { id, like } = req.body;
    if (like) {
      dbHandler.likeById(id);
      dbHandler.setLike(id, res.locals.user.id);
    } else {
      dbHandler.dislikeById(id);
      dbHandler.setDislike(id, res.locals.user.id);
    }
    const likeCount = await dbHandler.getLikesCountById(id);

    return res.status(201).json(likeCount);
  } catch (error) {
    console.log(error);
    res.status(500).render("500");
  }
});

router.get("/arts/comments/:art_id", async (req, res) => {
  try {
    let art_id = req.params.art_id;
    const comments = await dbHandler.getComments(art_id);
    return res.status(201).json(comments);
  } catch (error) {
    console.log(error);
    res.status(500).render("500");
  }
});

router.get("/getUserById/:user_id", async (req, res) => {
  try {
    let user_id = req.params.user_id;
    const user = await dbHandler.getUserBy("user_id", user_id);
    return res.status(201).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).render("500");
  }
});

router.post("/arts/sendComment", async (req, res) => {
  try {
    let { art_id, user_id, comment_text } = req.body;
    await dbHandler.addComment(art_id, user_id, comment_text);
    return res.status(201).json({});
  } catch (error) {
    console.log(error);
    res.status(500).render("500");
  }
});

router.post("/deleteComment", async (req, res) => {
  try {
    const { comment_id } = req.body;
    await dbHandler.deleteComment(comment_id);
    return res.status(201).json({});
  } catch (error) {
    console.log(error);
    res.status(500).render("500");
  }
});

module.exports = router;
