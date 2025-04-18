const app = require("express");
const productRouter = app.Router();

const auth = require("../../utils/auth");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destinationPath = path.join(__dirname, "../../public/product_images");
    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const originalName = path.parse(file.originalname).name; // Extract original file name without extension
    const extension = path.extname(file.originalname); // Extract file extension
    cb(null, originalName + "-" + uniqueSuffix + extension);
  },
});

const upload = multer({ storage });

const {
  addProduct,
  getProducts,
  delMultipleProducts,
  getSpecificProduct,
  updateProduct,
  getVarientOptions,
  getOptionValues,
  activeMultipleProducts,
  deactiveMultipleProducts,
  delProductImage,
  getSpecificVarientByProduct,
  getAllVarients,
  getArticleNumForProduct,
} = require("../../controllers/AdminControllers/ProductControllers");

productRouter.post(
  "/admin/add-product",
  auth,
  upload.array("images", 5),
  addProduct
);
productRouter.get("/admin/get-products", auth, getProducts);
productRouter.post(
  "/admin/delete-multiple-products",
  auth,
  delMultipleProducts
);
productRouter.get("/admin/get-specific-product/:id", auth, getSpecificProduct);
productRouter.post(
  "/admin/update-product/:id",
  auth,
  upload.array("images", 5),
  updateProduct
);
productRouter.get("/admin/get-varient-options", auth, getVarientOptions);
productRouter.get("/admin/get-option-values", auth, getOptionValues);
productRouter.post(
  "/admin/active-multiple-products",
  auth,
  activeMultipleProducts
);
productRouter.post(
  "/admin/deactive-multiple-products",
  auth,
  deactiveMultipleProducts
);

productRouter.get("/admin/del-product-image/:imgId", auth, delProductImage);

productRouter.get(
  "/admin/get-specific-varients-by-product/:id",
  auth,
  getSpecificVarientByProduct
);
productRouter.get("/admin/get-all-varients", auth, getAllVarients);
productRouter.get(
  "/admin/get-article-num-for-product",
  auth,
  getArticleNumForProduct
);

module.exports = productRouter;
