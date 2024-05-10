const express = require("express");
const router = express.Router();
const instHandler = require("../utils/instagramHandler");
const dbHandler = require("../utils/dbHandler");

router.get("/arts", async (req, res) => {
  try {
    // await dbHandler.init(); // Uz bolo spustene
    await dbHandler.updateArts();
    const allArts = await dbHandler.getAllArts();
    // Pages:
    const page = req.query.page || 1;
    const pageSize = 5;
    const offset = (page - 1) * pageSize;
    const totalPages = Math.ceil(allArts.length / pageSize);

    let arts;
    if (req.query.search) {
      // Filter posts by key word containing the search keyword
      arts = await dbHandler.getArtsByKeyWord(req.query.search);
    } else {
      // Get all posts if no search keyword is provided
      arts = allArts;
    }

    return res.render("arts", {
      arts: arts,
      allArts: allArts,
      currentPage: parseInt(page),
      totalPages: totalPages,
    });
  } catch (error) {
    console.log(error);
    res.status(500).render("500");
  }
});
module.exports = router;
