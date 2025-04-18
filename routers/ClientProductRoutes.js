const app = require("express");
const clientProductRouter = app.Router();

const auth = require("../utils/auth");
const {
  getProducts,
  getSpecificProduct,
  getCategoriesWithSubCategories,
  getPricesByCategory,
  getAllServicePrices
} = require("../controllers/ClientProductControllers");

clientProductRouter.post("/api/get-products", getProducts);
clientProductRouter.get("/api/get-specific-product/:id", getSpecificProduct);
clientProductRouter.get("/api/get-categories-with-sub-categories",getCategoriesWithSubCategories);
clientProductRouter.post("/api/get-service-price-by-category", getPricesByCategory);
clientProductRouter.get("/api/get-all-service-prices", getAllServicePrices);


module.exports = clientProductRouter;
