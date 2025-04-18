const app = require("express");
const clientPageRouter = app.Router();

const {
  getFAQs,
  getTerms,
  getPolicies,
} = require("../controllers/ClientPageControllers");

clientPageRouter.get("/api/get-faqs", getFAQs);
clientPageRouter.get("/api/get-terms", getTerms);
clientPageRouter.get("/api/get-policies", getPolicies);
module.exports = clientPageRouter;
