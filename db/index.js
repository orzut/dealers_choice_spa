const Sequelize = require("sequelize");
const db = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost/acme_express_spa"
);

const syncAndSeed = async () => {
  await db.sync({ force: true });
};

module.exports = { syncAndSeed };
