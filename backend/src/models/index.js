const { Sequelize, DataTypes } = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/database')[env];

const sequelize = new Sequelize(config.url, config);

const db = {};

db.Contact = require('./contact')(sequelize, DataTypes);
db.Group = require('./group')(sequelize, DataTypes);
db.ContactGroup = require('./contactGroup')(sequelize, DataTypes);
db.CareerHistoryEntry = require('./careerHistoryEntry')(sequelize, DataTypes);
db.GroupInsight = require('./groupInsight')(sequelize, DataTypes);

Object.values(db).forEach((model) => {
  if (model.associate) model.associate(db);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
