const { urlencoded } = require("body-parser");
const express = require("express");
const config = require("./config/app.js");
const app = express();

const SalesRouter = require("./routes/sales-routes.js");

app.use(express.json());
app.use("/sales", SalesRouter);

app.listen(config.port, () => {
  console.log(`Server started on port: ${config.port}.`);
});
