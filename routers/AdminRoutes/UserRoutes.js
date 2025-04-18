const app = require("express");
const userRouter = app.Router();

const auth = require("../../utils/auth");
const {
  addUser,
  getUsers,
  delMultipleUsers,
  getSpecificUser,
  updateUser,
} = require("../../controllers/AdminControllers/UserControllers");

userRouter.post("/admin/add-user", auth, addUser);
userRouter.get("/admin/get-users", auth, getUsers);
userRouter.post("/admin/delete-multiple-users", auth, delMultipleUsers);
userRouter.get("/admin/get-specific-user/:id", auth, getSpecificUser);
userRouter.post("/admin/update-user/:id", auth, updateUser);

module.exports = userRouter;
