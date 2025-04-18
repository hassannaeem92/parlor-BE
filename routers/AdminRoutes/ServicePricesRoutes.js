const app = require("express");
const servicePricesRouter = app.Router();
const auth = require("../../utils/auth");
const upload = require("../../middlewares/upload");

const {
  addServicePrices,
  getServicePrices,
  getSpecificServicePrices,
  updateServicePrices,
  getPricesByCategory,
  deleteServicePrices
} = require("../../controllers/AdminControllers/ServicePriceControllers");

servicePricesRouter.post("/admin/add-service-price", auth, upload.array('files', 20), addServicePrices);
servicePricesRouter.get("/admin/get-service-prices", auth, getServicePrices);
servicePricesRouter.get("/admin/get-service-prices-by-id/:id", auth, getSpecificServicePrices);
servicePricesRouter.post("/admin/update-service-price/:id", auth, upload.array('files', 20), updateServicePrices);
servicePricesRouter.post("/admin/delete-service-price", auth,  deleteServicePrices);



// servicePricesRouter.get("/admin/get-specific-serice-price/:id",auth,getSpecificServicePrices);
// servicePricesRouter.post("/admin/update-service-price/:id", auth, updateServicePrices);

module.exports = servicePricesRouter;
