const session = require("express-session");
const mongodbStore = require('connect-mongodb-session')




function createSessionStore (session) {
  const MongoDBStore = mongodbStore(session);

  const sessionStore = new MongoDBStore({
  uri: 'mongodb://127.0.0.1:27017',
  databaseName: 'BDS',
  collection: 'sessions'
})

  return sessionStore
}

function createSessionConfig (sessionStore) {
  return {
    secret: 'super-secret',
    resave: false,
    saveUninitialized: false,
    store: sessionStore
  }
}

module.exports = {
  createSessionStore: createSessionStore,
  createSessionConfig: createSessionConfig
}

