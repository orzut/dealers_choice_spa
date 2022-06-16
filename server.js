const { syncAndSeed, User, Restaurant, Meal, Order } = require("./db");
const express = require("express");
const app = express();
const path = require("path");

app.use("/assets", express.static("assets"));
app.use("/dist", express.static("dist"));

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

app.get("/api/users", async (req, res, next) => {
  try {
    res.send(await User.findAll());
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/restaurants", async (req, res, next) => {
  try {
    res.send(await Restaurant.findAll());
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/restaurants/:restaurantId/menu", async (req, res, next) => {
  try {
    res.send(
      await Meal.findAll({
        where: { restaurantId: req.params.restaurantId },
        include: [Restaurant],
      })
    );
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/users/:userId/orders", async (req, res, next) => {
  try {
    res.send(
      await Order.findAll({
        where: { userId: req.params.userId },
        include: [User, Meal],
      })
    );
  } catch (ex) {
    next(ex);
  }
});

app.post("/api/users/:userId/orders", async (req, res, next) => {
  try {
    res.status(201).send(
      await Order.create({
        userId: req.params.userId,
        mealId: req.body.mealId,
      })
    );
  } catch (ex) {
    next(ex);
  }
});

app.delete("/api/orders/:id", async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);
    await order.destroy();
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send(err);
});

const init = async () => {
  try {
    await syncAndSeed();
    console.log("Database has been setup");
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`listening on port ${port}`));
  } catch (ex) {
    console.log(ex);
  }
};

init();
