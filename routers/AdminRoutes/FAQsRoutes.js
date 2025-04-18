const app = require("express");
const faqsRouter = app.Router();
const auth = require("../../utils/auth");
const {
  addFAQs,
  getFAQs,
  deleteFAQs,
  getSpecificFAQs,
  updateFAQs,
  delMultipleFAQs,
} = require("../../controllers/AdminControllers/FAQsControllers");

faqsRouter.post("/admin/add-faqs", auth, addFAQs);
faqsRouter.get("/admin/get-faqs", auth, getFAQs);
faqsRouter.get("/admin/delete-faqs/:id", auth, deleteFAQs);
faqsRouter.get("/admin/get-specific-faqs/:id", auth, getSpecificFAQs);
faqsRouter.post("/admin/update-faqs/:id", auth, updateFAQs);
faqsRouter.post("/admin/delete-multiple-faqs", auth, delMultipleFAQs);

module.exports = faqsRouter;
