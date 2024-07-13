const db = require("../data/database");
const Base = require("./base.model");

class Like extends Base {
  constructor(data) {
    super(data);
  }

  async save() {
    await db.query(
      `
        INSERT INTO likes (user_id, art_id) VALUES (?, ?)
      `,
      [this.user_id, this.art_id]
    );
  }
  async delete() {
    await db.query(
      `
          DELETE FROM likes WHERE user_id=? and art_id=?
        `,
      [this.user_id, this.art_id]
    );
  }

  static async deleteByIds(art_id, user_id) {
    await db.query(
      `
        DELETE FROM likes WHERE user_id=? and art_id=?
      `,
      [user_id, art_id]
    );
  }

  static async isLiked(art_id, user_id) {
    const [like] = await db.query(
      `
      SELECT * FROM likes WHERE art_id=? and user_id=?
    `,
      [art_id, user_id]
    );
    if (like.length > 0) return true;
    return false;
  }
}

module.exports = Like;
