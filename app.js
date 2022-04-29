require("dotenv").config();
require("express-async-errors");
const express = require("express");
const notFound = require("./middleware/not-found");
const app = express();
const errorHandlerMiddleware = require("./middleware/error-handler");
const connectDB = require("./db/connect");
const productRouter = require("./routes/products");
// middlewares
app.use(express.json());
// routes
app.get("/", (req, res) => {
  res.send('<h1>Store API</h1><a href="/api/v1/products">products route</a>');
});

// product API
app.use("/api/v1/products", productRouter);

app.use(notFound);
app.use(errorHandlerMiddleware);
// Start server
const port = process.env.PORT || 3001;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`server started at \n http://localhost:${port}/`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
