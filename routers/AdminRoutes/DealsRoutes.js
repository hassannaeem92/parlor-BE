const app = require("express");
const DealsRouter = app.Router();
const auth = require("../../utils/auth");
const upload = require("../../middlewares/upload");

const {
  addDeals,
  getDeals,
  getSpecificDealById,
  updateDeals,
  // getPricesByCategory
} = require("../../controllers/AdminControllers/DealControllers");

DealsRouter.post("/admin/addDeals", auth, upload.array('files', 20), addDeals);
DealsRouter.get("/admin/getDeals", auth, getDeals);
DealsRouter.get("/admin/getSpecificDealById/:id", auth, getSpecificDealById);
DealsRouter.post("/admin/updateDeals/:id", auth, upload.array('files', 20), updateDeals);



// servicePricesRouter.get("/admin/get-specific-serice-price/:id",auth,getSpecificServicePrices);
// servicePricesRouter.post("/admin/update-service-price/:id", auth, updateServicePrices);

module.exports = DealsRouter;
