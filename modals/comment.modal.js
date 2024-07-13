const db = require("../data/database");
const Base = require("./base.model");

class Comment extends Base {
  constructor(data) {
    super(data);
  }
  static async fetchAllByArtId(art_id) {
    const comments = await db.query(
      `
    SELECT * FROM comments WHERE art_id=?
      `,
      [art_id]
    );
    return comments;
  }

  async save() {
    await db.query(
      `
      INSERT INTO comments (art_id, user_id, comment_text) VALUES (?, ?, ?)
      `,
      [this.art_id, this.user_id, this.comment_text]
    );
  }

  async deleteCommentById(comment_id) {
    await db.query(
      `
      DELETE FROM comments WHERE comment_id=?
      `,
      comment_id
    );
  }
}

module.exports = Comment;
