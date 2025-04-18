const app = require("express");
const termsRouter = app.Router();
const auth = require("../../utils/auth");

const {
  addTerms,
  getTerms,
  deleteTerms,
  getSpecificTerms,
  updateTerms,
  delMultipleTerms,
} = require("../../controllers/AdminControllers/TermsControllers");

termsRouter.post("/admin/add-terms", auth, addTerms);
termsRouter.get("/admin/get-terms", auth, getTerms);
termsRouter.get("/admin/delete-terms/:id", auth, deleteTerms);
termsRouter.get("/admin/get-specific-terms/:id", auth, getSpecificTerms);
termsRouter.post("/admin/update-terms/:id", auth, updateTerms);
termsRouter.post("/admin/delete-multiple-terms", auth, delMultipleTerms);

module.exports = termsRouter;
