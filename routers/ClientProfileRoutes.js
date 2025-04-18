const express = require("express");
const clientProfileRouter = express.Router();
const auth = require("../utils/auth");
const {
  getSpecificUser,
  updateUser,
  updateUserPic,
} = require("../controllers/ClientProfileControllers");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/profile_pics");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

clientProfileRouter.get("/api/get-specific-user/:id", auth, getSpecificUser);
clientProfileRouter.post("/api/update-user/:id", auth, updateUser);
clientProfileRouter.post(
  "/api/update-user-pic/:id",
  upload.single("img"),
  auth,
  updateUserPic
);

module.exports = clientProfileRouter;
