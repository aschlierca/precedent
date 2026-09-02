const app = require('./src/app');

const PORT = process.env.PORT || 4000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Precedent API listening on port ${PORT}`);
  });
}

module.exports = app;
