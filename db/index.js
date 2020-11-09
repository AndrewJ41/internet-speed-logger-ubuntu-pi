const config = require('config');
const { MongoClient } = require('mongodb');
const db = config.get('db');

const mongoUrl = `mongodb://${db.user}:${db.password}@${db.ip}:${db.port}/${db.name}`;

function connect(url) {
  return MongoClient.connect(url, {useUnifiedTopology:true}).then((client) => client.db());
}

module.exports = async () => {
  const database = await Promise.all([connect(mongoUrl, {
    poolSize: 10,
  })]);
  return database[0].collection(config.get('db.collection'));
};
