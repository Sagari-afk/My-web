const db = require("../data/database");
const instHandler = require("../utils/instagramHandler");

class Base {
  constructor(data) {
    for (const key in data) {
      this[key] = data[key];
    }
  }

  static async initDB() {
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
            user_img_url TEXT,
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
  }
}

module.exports = Base;
