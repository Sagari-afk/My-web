const db = require("../data/database");
const Base = require("./base.model");

class User extends Base {
  constructor(data) {
    super(data);
  }

  async save() {
    await db.query(
      `
      INSERT INTO users (name, surname, email, password, salt, user_img_url) VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        this.name,
        this.surname,
        this.email,
        this.password,
        this.salt,
        "/assets/profile-none-img.png",
      ]
    );
  }

  static async fetchUserBy(col, value) {
    const [records] = await db.query(
      `
      SELECT * FROM users WHERE ${col} = ?
      `,
      value
    );
    return [records];
  }

  static async fetchAll() {
    const [records] = await db.query(
      `
      SELECT * FROM users
      `
    );
    return records;
  }

  static async updateUser(user) {
    const { id, name, surname, email, avatar } = user;
    await db.query(
      `
    UPDATE users SET name=?, surname=?, email=?, user_img_url=? WHERE user_id = ?`,
      [name, surname, email, avatar, id]
    );
  }

  static async setUserAdminStatusById(id, isAdmin) {
    await db.query(
      `
      UPDATE users SET isAdmin=? WHERE user_id=?
    `,
      [isAdmin, id]
    );
  }

  static async deleteUserById(id) {
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
  }
}

module.exports = User;
