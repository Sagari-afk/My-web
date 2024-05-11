const db = require("../data/database");
const instHandler = require("../utils/instagramHandler");

const init = async () => {
  const instPostIds = await instHandler.getInstPostsIds();
  await db.query(`
              CREATE TABLE IF NOT EXISTS arts  (
              art_id INT NOT NULL auto_increment,
              img_url TEXT NOT NULL,
              title varchar(255) NOT NULL,
              description TEXT,
              likes_count INT default 0,
              post_url TEXT NOT NULL,
              primary key(art_id)
          );`);
  for (id of instPostIds) {
    insertArt(id);
  }
};

const insertArt = async (id) => {
  const temp = await instHandler.getInstPostById(id);
  console.log("temp:", temp);
  await db.query(
    `
          INSERT INTO arts (img_url, title, description, post_id, post_url) VALUES
          (?, ?, ?, ?, ?);`,
    [temp.media_url, "Art", temp.caption, id, temp.permalink]
  );
};

const getLikesCountById = async (id) => {
  return await db.query(`SELECT likes_count FROM arts WHERE art_id = (?)`, id);
};

const likeById = async (id) => {
  let likes = await getLikesCountById(id);
  likes = likes[0][0].likes_count;

  likes++;
  console.log("likes from dbHandler: ", likes);
  await db.query(
    `
  UPDATE arts SET likes_count = (?) WHERE art_id = (?)`,
    [likes, id]
  );
};

const dislikeById = async (id) => {
  let likes = await getLikesCountById(id);
  likes = likes[0][0].likes_count;
  if (likes < 1) return;
  likes--;
  console.log("dislikes from dbHandler: ", likes);
  await db.query(
    `
  UPDATE arts SET likes_count = (?) WHERE art_id = (?)`,
    [likes, id]
  );
};

const updateArts = async () => {
  const instPostIds = await instHandler.getInstPostsIds();
  const existingArts = await getAllArts();
  let existingPostIds = [];
  for (e of existingArts) {
    existingPostIds.push(e.post_id);
  }

  for (id of instPostIds) {
    if (!existingPostIds.includes(id)) {
      console.log();
      console.log("new post");
      insertArt(id);
    }
  }
};

const getArtsByKeyWord = async (keyWord) => {
  keyWord = "%" + keyWord + "%";
  const [records] = await db.query(
    `SELECT * FROM arts WHERE description LIKE (?) `,
    keyWord
  );
  return records;
};

const getAllArts = async () => {
  const [records] = await db.query(`SELECT * FROM arts`);
  return records;
};

module.exports = {
  init,
  getAllArts,
  updateArts,
  getArtsByKeyWord,
  likeById,
  dislikeById,
  getLikesCountById,
};
