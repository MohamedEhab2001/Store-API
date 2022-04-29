require("dotenv").config();

const connectDB = require("./db/connect");
const Product = require("./models/product");

const jsonProducts = require("./products.json");

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await Product.deleteMany(); // to delete evey product in the database
    await Product.create(jsonProducts); // adding my new array of product
    console.log("success !!!");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
start();
