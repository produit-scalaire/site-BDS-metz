const db = require('../data/database')
const mongodb = require('mongodb')

class Post {
  constructor(title, content, id) {
    this.title = title;
    this.content = content;
    if (id) {
      this.id = new objectId
    }
  }
  async insert() {
    let result
    if (this.id) {
      result = await db.getDb().collection('posts').updateOne(
        {_id: this.id},
        {$set: {title: this.title, content: this.content}}
      )
    } else {
      result = await db.getDb().collection('posts').insertOne({
        title: this.title,
        content: this.content,
      });
    }

    return result
  }
}

module.exports = Post;