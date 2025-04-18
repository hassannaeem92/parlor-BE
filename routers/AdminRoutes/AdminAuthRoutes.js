const app = require("express");
const {
  register,
  login,
  setNewPassword,
} = require("../../controllers/AdminControllers/AdminAuthControllers");
const adminAuthRouter = app.Router();

adminAuthRouter.post("/admin/register", register);
adminAuthRouter.post("/admin/login", login);
adminAuthRouter.post("/admin/:id/set-new-password/:token/", setNewPassword);

module.exports = adminAuthRouter;
