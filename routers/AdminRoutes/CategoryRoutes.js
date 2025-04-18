const app = require("express");
const categoryRouter = app.Router();
const upload = require("../../middlewares/upload");

const {
  addCategory,
  getCategory,
  deleteCategory,
  getSpecificCategory,
  updateCategory,
  delMultipleCategory,
  addSubCategory,
  getSubCategory,
  getSpecificSubCategory,
  updateSubCategory,
  delMultipleSubCategory,
} = require("../../controllers/AdminControllers/CategoryControllers");
const auth = require("../../utils/auth");

categoryRouter.post("/admin/add-category", auth, upload.array('files', 20), addCategory);
categoryRouter.get("/admin/get-category", auth, getCategory);
categoryRouter.get("/admin/delete-category/:id", auth, deleteCategory);
categoryRouter.get(
  "/admin/get-specific-category/:id",
  auth,
  getSpecificCategory
);
categoryRouter.post("/admin/update-category/:id", auth, upload.array('files', 20), updateCategory);
categoryRouter.post(
  "/admin/delete-multiple-category",
  auth,
  delMultipleCategory
);
categoryRouter.post("/admin/add-sub-category", auth, addSubCategory);
categoryRouter.get("/admin/get-sub-category", auth, getSubCategory);
categoryRouter.get(
  "/admin/get-specific-sub-category/:id",
  auth,
  getSpecificSubCategory
);
categoryRouter.post("/admin/update-sub-category/:id", auth, updateSubCategory);
categoryRouter.post(
  "/admin/delete-multiple-sub-category",
  auth,
  delMultipleSubCategory
);

module.exports = categoryRouter;
