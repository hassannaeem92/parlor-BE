const app = require("express");
const authRouter = app.Router();
const {
  register,
  login,
  verifyToken,
  forgotPassword,
  resetPassword,
} = require("../controllers/AuthControllers");

authRouter.post("/api/register", register);
authRouter.post("/api/login", login);
authRouter.post("/api/forgot-password", forgotPassword);
authRouter.get("/api/:id/verify/:token/", verifyToken);
authRouter.post("/api/:id/reset-password/:token/", resetPassword);

module.exports = authRouter;
