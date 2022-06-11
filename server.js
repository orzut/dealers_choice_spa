const db = require("./db");
const express = require("express");
const app = express();
const path = require("path");
const faker = require("@faker-js/faker");

console.log(faker.faker.company.companyName());

app.use("/assets", express.static("assets"));
app.use("/dist", express.static("dist"));

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

const init = async () => {
  try {
    await db.syncAndSeed();
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`listening on port ${port}`));
  } catch (ex) {
    console.log(ex);
  }
};

init();
