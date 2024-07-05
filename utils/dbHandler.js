const db = require("../data/database");
const instHandler = require("../utils/instagramHandler");

const init = async () => {
  const instPostIds = await instHandler.getInstPostsIds();
  // create ARTS table in DB
  await db.query(`
              CREATE TABLE IF NOT EXISTS arts  (
              art_id INT NOT NULL auto_increment,
              img_url TEXT NOT NULL,
              description TEXT,
              likes_count INT default 0,
              post_id VARCHAR(45) NOT NULL,
              post_url TEXT NOT NULL,
              date DATETIME NOT NULL,
              primary key(art_id)
          );`);

  // create USERS table in DB
  await db.query(`
      CREATE TABLE IF NOT EXISTS users(
      user_id INT NOT NULL AUTO_INCREMENT,
      name varchar(255) NOT NULL,
      surname varchar(255) NOT NULL,
      email varchar(255) NOT NULL,
      password varchar(255) NOT NULL,
      salt varchar(255) NOT NULL,
      PRIMARY KEY (user_id)
  );`);

  // create LIKES table in DB
  await db.query(`
      CREATE TABLE IF NOT EXISTS likes(
      like_id INT NOT NULL AUTO_INCREMENT,
      user_id INT NOT NULL,
      art_id INT NOT NULL,
      PRIMARY KEY (like_id),
      FOREIGN KEY (user_id) REFERENCES users(user_id),
      FOREIGN KEY (art_id) REFERENCES arts(art_id)
  );`);

    // create COMMENTS table in DB
    await db.query(`
      CREATE TABLE IF NOT EXISTS comments(
      comment_id INT NOT NULL AUTO_INCREMENT,
      user_id INT NOT NULL,
      art_id INT NOT NULL,
      comment_text TEXT NOT NULL,
      PRIMARY KEY (comment_id),
      FOREIGN KEY (user_id) REFERENCES users(user_id),
      FOREIGN KEY (art_id) REFERENCES arts(art_id)
  );`);

  // add arts to db if not exists
  for (id of instPostIds) {
    const art = getArtsBy("post_id", id);
    if (!art) insertArt(id);
  }
};

const createUser = async (name, surname, email, password, salt) => {
  await db.query(
    `
    INSERT INTO users (name, surname, email, password, salt, user_img_url) VALUES (?, ?, ?, ?, ?, ?)
  `,
    [name, surname, email, password, salt, "/assets/profile-none-img.png"]
  );
};

const getUserBy = async (col, value) => {
  const [records] = await db.query(
    `
  SELECT * FROM users WHERE ${col} = ?
  `,
    value
  );
  return records;
};
const getArtsBy = async (col, value) => {
  const [records] = await db.query(
    `
  SELECT * FROM arts WHERE ${col} = ?
  `,
    value
  );
  return records;
};
const getAllUsers = async () => {
  const [records] = await db.query(
    `
  SELECT * FROM users 
  `
  );
  return records;
};

const updateUser = async (user) => {
  const { id, name, surname, email, avatar } = user;
  await db.query(
    `
  UPDATE users SET name=?, surname=?, email=?, user_img_url=? WHERE user_id = ?`,
    [name, surname, email, avatar, id]
  );
};

const insertArt = async (id) => {
  const temp = await instHandler.getInstPostById(id);
  await db.query(
    `
          INSERT INTO arts (img_url, description, post_id, post_url, date) VALUES
          (?, ?, ?, ?, ?);`,
    [temp.media_url, temp.caption, id, temp.permalink, new Date(temp.timestamp)]
  );
};

const getLikesCountById = async (id) => {
  return await db.query(`SELECT likes_count FROM arts WHERE art_id = (?)`, id);
};

const likeById = async (id) => {
  let likes = await getLikesCountById(id);
  likes = likes[0][0].likes_count;

  likes++;
  await db.query(
    `
  UPDATE arts SET likes_count = (?) WHERE art_id = (?)`,
    [likes, id]
  );
};

const setLike = async (art_id, user_id) => {
  await db.query(
    `
    INSERT INTO likes (user_id, art_id) VALUES (?, ?)
  `,
    [user_id, art_id]
  );
};

const setDislike = async (art_id, user_id) => {
  await db.query(
    `
    DELETE FROM likes WHERE user_id=? and art_id=?
  `,
    [user_id, art_id]
  );
};

const isLiked = async (art_id, user_id) => {
  const [like] = await db.query(
    `
    SELECT * FROM likes WHERE art_id=? and user_id=?
  `,
    [art_id, user_id]
  );
  if (like.length > 0) return true;
  return false;
};

const dislikeById = async (id) => {
  let likes = await getLikesCountById(id);
  likes = likes[0][0].likes_count;
  if (likes < 1) return;
  likes--;
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
      insertArt(id);
    }
  }
};

const updateLinksOnArts = async () => {
  const instagramPosts = await getAllArts();
  for (post of instagramPosts) {
    const postFromInstAPI = await instHandler.getInstPostById(post.post_id);
    if (postFromInstAPI.media_url !== post.img_url) {
      if (!postFromInstAPI.media_url) {
        continue
      }
      console.log(`Img url of post with post_id ${post.post_id} was updated`)
      await db.query(
        `
      UPDATE arts SET img_url = (?) WHERE post_id = (?)`,
        [postFromInstAPI.media_url, post.post_id]
      );
    }
  }

}

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

const getComments = async (art_id) => {
  const comments = await db.query(
    `
  SELECT * FROM comments WHERE art_id=?
  `,
    [art_id]
  );
  return comments;
};

const addComment = async (art_id, user_id, comment_text) => {
  await db.query(
    `
    INSERT INTO comments (art_id, user_id, comment_text) VALUES (?, ?, ?)
  `,
    [art_id, user_id, comment_text]
  );
};

const setUserAdmin = async (id, isAdmin) => {
  await db.query(
    `
    UPDATE users SET isAdmin=? WHERE user_id=?
  `,
    [isAdmin, id]
  );
};

const deleteUser = async (id) => {
  await db.query(
    `
    DELETE FROM likes WHERE user_id=?
  `,
    id
  );
  await db.query(
    `
  DELETE FROM comments WHERE user_id=?
`,
    id
  );
  await db.query(
    `
    DELETE FROM users WHERE user_id=?
  `,
    id
  );
};

const deleteComment = async (comment_id) => {
  await db.query(
    `
    DELETE FROM comments WHERE comment_id=?
  `,
    comment_id
  );
};

module.exports = {
  init,
  getAllArts,
  updateArts,
  updateLinksOnArts,

  getArtsByKeyWord,
  likeById,
  dislikeById,
  getLikesCountById,
  createUser,
  getUserBy,
  getAllUsers,
  updateUser,

  setDislike,
  setLike,
  isLiked,

  getComments,
  addComment,
  deleteComment,

  setUserAdmin,
  deleteUser,
};
