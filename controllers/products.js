const Product = require("../models/product");
const {
  fieldsFilter,
  sortFilter,
  pagesFilter,
  numiricFilter,
} = require("./filtring");

const getAllProductsStatic = async (req, res) => {
  const Pr = await Product.find({});
  res.status(200).json({
    Pr,
    nbHits: Pr.length,
  });
};
// company, name, sort, fields, numericFilters
const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numFilter } = req.query;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  let queryObject = {};
  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }
  // numeric filters
  queryObject = numiricFilter(numFilter, queryObject);

  let result = Product.find(queryObject);
  // This variable duty is inform the API how many items is returned before excute the limit function so the API can return the number of pages
  const FixedResult = await result;
  // console.log(result.constructor.name);

  // pages
  result = pagesFilter(page, result, limit, skip);

  // sort
  result = sortFilter(sort, result);

  //fields
  result = fieldsFilter(fields, result);

  const Pr = await result;

  //console.log("---------------------------------------");
  //console.log(Pr.constructor.name);

  if (Pr.length === 0) {
    return res.status(404).json({
      msg: "No product found",
      Query: queryObject,
      nbHits: Pr.length,
    });
  }
  res.status(200).json({
    nbPages: Math.ceil(parseFloat(FixedResult.length / limit)),
    usePages: "to use page please add the ?page=<number of page> to the url",
    nbHits: Pr.length,
    Pr,
    Query: queryObject,
  });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
