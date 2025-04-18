const express = require("express");
const HomeSectionRoutes = express.Router();
const auth = require("../utils/auth");
const upload = require("./../middlewares/upload");

const { 
  addOurWorkSection,
  updateOurWorkSection,
  getDeals,
  getOurWorkSection,
  getSpecificDealById
 } = require("../controllers/HomeSectionControllers");


 HomeSectionRoutes.post("/api/addOurWorkSection", upload.array('files', 20), addOurWorkSection);
 HomeSectionRoutes.post("/api/updateOurWorkSection", upload.array('files', 20),  updateOurWorkSection);
 HomeSectionRoutes.get("/api/getHomeDeals", getDeals);
 HomeSectionRoutes.get("/api/getOurWorkSection", getOurWorkSection);
 HomeSectionRoutes.get("/api/getSpecificDealById/:id", getSpecificDealById);






module.exports = HomeSectionRoutes;
