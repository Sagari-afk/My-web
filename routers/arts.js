const express = require("express");
const router = express.Router();

const {
  getArts,
  searchArts,
  isLikedByUser,
  likeArt,
  getArtComments,
  sendComment,
  deleteComment,
} = require("../controllers/artsController");

router.get("/arts", getArts);
router.get("/getArts/search=:search", searchArts);
router.get("/isLiked/:art_id/:user_id", isLikedByUser);
router.get("/arts/comments/:art_id", getArtComments);

router.post("/arts", likeArt);
router.post("/arts/sendComment", sendComment);
router.post("/deleteComment", deleteComment);

module.exports = router;
