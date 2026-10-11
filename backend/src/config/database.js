require('dotenv').config();

const base = {
  dialect: 'postgres',
  dialectModule: require('pg'),
  logging: false,
};

module.exports = {
  development: {
    ...base,
    url: process.env.DATABASE_URL || 'postgres://localhost:5432/precedent_dev',
  },
  test: {
    ...base,
    url: process.env.TEST_DATABASE_URL || 'postgres://localhost:5432/precedent_test',
  },
  production: {
    ...base,
    url: process.env.DATABASE_URL,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
