const db = require("../data/database");
const Base = require("./base.model");
const Like = require("./like.modal");
const instHandler = require("../utils/instagramHandler");

class Art extends Base {
  constructor(data) {
    super(data);
  }

  static async fetchBy(col, val) {
    const [records] = await db.query(
      `
      SELECT * FROM arts WHERE ${col} = ?
      `,
      val
    );
    return records;
  }

  static async fetchAll() {
    return await db.query(
      `
      SELECT * FROM arts
      `
    );
  }

  static async saveFromInst(id) {
    const temp = await instHandler.getInstPostById(id);
    await db.query(
      `
          INSERT INTO arts (img_url, description, post_id, post_url, date) VALUES
          (?, ?, ?, ?, ?);`,
      [
        temp.media_url,
        temp.caption,
        id,
        temp.permalink,
        new Date(temp.timestamp),
      ]
    );
  }

  async save() {
    await db.query(
      `
            INSERT INTO arts (img_url, description, post_id, post_url, date) VALUES
            (?, ?, ?, ?, ?);`,
      [img_url, description, post_id, post_url, new Date(date)]
    );
  }

  static async isLikedByIds(art_id, user_id) {
    const [like] = await db.query(
      `
    SELECT * FROM likes WHERE art_id=? and user_id=?
      `,
      [art_id, user_id]
    );
    if (like.length > 0) return true;
    return false;
  }

  static async likeByPostId(id) {
    let [art] = await fetchBy("art_id", id);
    const likes = art.likes_count;
    const user_id = art.user_id;

    likes++;

    const likeInstanse = new Like({ id, user_id });
    likeInstanse.save();

    await db.query(
      `
    UPDATE arts SET likes_count = (?) WHERE art_id = (?)`,
      [likes, id]
    );
  }

  static async dislikeByPostId(id) {
    let [art] = await fetchBy("art_id", id);
    const likes = art.likes_count;
    const user_id = art.user_id;

    if (likes < 1) return;
    likes--;
    Like.deleteByIds(id, user_id);

    await db.query(
      `
    UPDATE arts SET likes_count = (?) WHERE art_id = (?)`,
      [likes, id]
    );
  }

  static async updateArts() {
    const instPostIds = await instHandler.getInstPostsIds();
    const existingArts = await Art.fetchAll();

    let existingPostIds = [];

    for (let e of existingArts) {
      existingPostIds.push(e.post_id);
      Art.updateLinksOnArts();
    }

    for (let id of instPostIds) {
      if (!existingPostIds.includes(id)) {
        Art.saveFromInst(id);
        console.log(`New art with post_id ${id} was saved to database!`);
      }
    }
  }

  static async updateLinksOnArts() {
    const instagramPosts = await Art.fetchAll();

    for (let post of instagramPosts) {
      const postFromInstAPI = await instHandler.getInstPostById(post.post_id);

      if (postFromInstAPI.media_url !== post.img_url) {
        if (!postFromInstAPI.media_url) {
          continue;
        }

        console.log(
          `Img url of post with post_id ${post.post_id} was updated!`
        );

        await db.query(
          `
        UPDATE arts SET img_url = (?) WHERE post_id = (?)`,
          [postFromInstAPI.media_url, post.post_id]
        );
      }
    }
  }

  static async getArtsByKeyWord(keyWord) {
    keyWord = "%" + keyWord + "%";

    const [records] = await db.query(
      `SELECT * FROM arts WHERE description LIKE (?) `,
      keyWord
    );
    return records;
  }
}

module.exports = Art;
