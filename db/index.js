const { UUID, UUIDV4, STRING, INTEGER } = require("sequelize");
const Sequelize = require("sequelize");
const db = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost/acme_express_spa"
);

const User = db.define("user", {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  name: {
    type: STRING(20),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

const Restaurant = db.define("restaurant", {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  name: {
    type: STRING(20),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

const Meal = db.define("meal", {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  name: {
    type: STRING(20),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  price: {
    type: INTEGER,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

const Order = db.define("order", {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
});

Order.belongsTo(User);
Order.belongsTo(Restaurant);
Order.belongsTo(Meal);
Meal.belongsTo(Restaurant);

const syncAndSeed = async () => {
  await db.sync({ force: true });
  const [anna, jack, catalina, chris] = await Promise.all(
    ["Anna", "Jack", "Catalina", "Chris"].map((name) => User.create({ name }))
  );
  const [napolitana, boka, mercadito, taxim, kizuki] = await Promise.all(
    ["Napolitana", "Boka", "Mercadito", "Taxim", "Kizuki"].map((name) =>
      Restaurant.create({ name })
    )
  );
  const [
    sushi,
    pizza,
    pasta,
    gyro,
    ramen,
    taco,
    burger,
    guacamole,
    tzatziki,
    hummus,
    steak,
    edamame,
    burrata,
    potatoes,
    chile,
  ] = await Promise.all([
    Meal.create({ name: "Sushi", price: 18, restaurantId: kizuki.id }),
    Meal.create({ name: "Pizza", price: 14, restaurantId: napolitana.id }),
    Meal.create({ name: "Pasta", price: 20, restaurantId: napolitana.id }),
    Meal.create({ name: "Gyro", price: 14, restaurantId: taxim.id }),
    Meal.create({ name: "Ramen", price: 16, restaurantId: kizuki.id }),
    Meal.create({ name: "Taco", price: 12, restaurantId: mercadito.id }),
    Meal.create({ name: "Burger", price: 22, restaurantId: boka.id }),
    Meal.create({ name: "Guacamole", price: 5, restaurantId: mercadito.id }),
    Meal.create({ name: "Tzatziki", price: 5, restaurantId: taxim.id }),
    Meal.create({ name: "Hummus", price: 5, restaurantId: taxim.id }),
    Meal.create({ name: "Rib Eye steak", price: 42, restaurantId: boka.id }),
    Meal.create({ name: "Edamame", price: 8, restaurantId: kizuki.id }),
    Meal.create({ name: "Burrata", price: 12, restaurantId: napolitana.id }),
    Meal.create({ name: "Roasted potatoes", price: 12, restaurantId: boka.id }),
    Meal.create({ name: "Chile soup", price: 5, restaurantId: mercadito.id }),
  ]);

  await Promise.all([
    Order.create({
      userId: anna.id,
      restaurantId: napolitana.id,
      mealId: pizza.id,
    }),
    Order.create({
      userId: jack.id,
      restaurantId: mercadito.id,
      mealId: taco.id,
    }),
    Order.create({
      userId: catalina.id,
      restaurantId: taxim.id,
      mealId: gyro.id,
    }),
    Order.create({
      userId: chris.id,
      restaurantId: kizuki.id,
      mealId: ramen.id,
    }),
  ]);
};

module.exports = { syncAndSeed, User, Restaurant, Meal, Order };
