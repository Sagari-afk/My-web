const Art = require("../modals/art.model");
const Comment = require("../modals/comment.modal");

const getArts = async (req, res) => {
  try {
    await Art.initDB();

    await Art.updateArts();
    const allArts = await Art.fetchAll();

    let arts;
    if (req.query.search) {
      // Filter posts by key word containing the search keyword
      arts = await Art.getArtsByKeyWord(req.query.search);
    } else {
      arts = allArts[0];
    }
    arts.sort((a, b) => b.date - a.date);

    return res.render("arts", {
      allArts: arts,
      user_id: res.locals.user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).render("500");
  }
};

const searchArts = async (req, res) => {
  try {
    const allArts = await Art.fetchAll();
    const query = req.params.search;

    let arts;
    if (query && query != "all") {
      // Filter posts by key word containing the search keyword
      arts = await Art.getArtsByKeyWord(query);
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
};

const isLikedByUser = async (req, res) => {
  try {
    const art_id = req.params.art_id;
    const user_id = req.params.user_id;
    if (!user_id) return;
    const isLiked = await Art.isLikedByIds(art_id, user_id);
    return res.json({ isLiked });
  } catch (error) {
    console.log(error);
    res.status(500).render("500");
  }
};

const likeArt = async (req, res) => {
  try {
    let { id, like } = req.body;
    if (like) {
      Art.likeByPostId(id);
    } else {
      Art.dislikeByPostId(id);
    }
    let [art] = await fetchBy("art_id", id);
    const likeCount = art.likes_count;

    return res.status(201).json(likeCount);
  } catch (error) {
    console.log(error);
    res.status(500).render("500");
  }
};

const getArtComments = async (req, res) => {
  try {
    let art_id = req.params.art_id;
    const comments = await Comment.fetchAllByArtId(art_id);
    return res.status(201).json(comments);
  } catch (error) {
    console.log(error);
    res.status(500).render("500");
  }
};

const sendComment = async (req, res) => {
  try {
    let { art_id, user_id, comment_text } = req.body;
    const comment = new Comment({ art_id, user_id, comment_text });
    await comment.save();
    return res.status(201).json({});
  } catch (error) {
    console.log(error);
    res.status(500).render("500");
  }
};

const deleteComment = async (req, res) => {
  try {
    const { comment_id } = req.body;
    await Comment.deleteCommentById(comment_id);
    return res.status(201).json({});
  } catch (error) {
    console.log(error);
    res.status(500).render("500");
  }
};

module.exports = {
  getArts,
  searchArts,
  isLikedByUser,
  likeArt,
  getArtComments,
  sendComment,
  deleteComment,
};
