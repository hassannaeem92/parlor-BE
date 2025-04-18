const app = require("express");
const currencyRouter = app.Router();

const auth = require("../../utils/auth");
const {
  addCurrency,
  getCurrency,
  updateCurrency,
  getSpecificCurrency,
  delMultipleCurrency,
  getEnableCurrency,
} = require("../../controllers/AdminControllers/CurrencyControllers");

currencyRouter.post("/admin/add-currency", auth, addCurrency);
currencyRouter.get("/admin/get-currency", auth, getCurrency);
currencyRouter.post(
  "/admin/delete-multiple-currency",
  auth,
  delMultipleCurrency
);
currencyRouter.get(
  "/admin/get-specific-currency/:id",
  auth,
  getSpecificCurrency
);
currencyRouter.get("/admin/get-enable-currency", auth, getEnableCurrency);
currencyRouter.post("/admin/update-currency/:id", auth, updateCurrency);

module.exports = currencyRouter;
