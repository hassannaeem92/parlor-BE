const app = require("express");
const policiesRouter = app.Router();
const auth = require("../../utils/auth");

const {
  addPolicies,
  getPolicies,
  deletePolicies,
  getSpecificPolicies,
  updatePolicies,
  delMultiplePolicies,
} = require("../../controllers/AdminControllers/PoliciesControllers");

policiesRouter.post("/admin/add-policies", auth, addPolicies);
policiesRouter.get("/admin/get-policies", auth, getPolicies);
policiesRouter.get("/admin/delete-policies/:id", auth, deletePolicies);
policiesRouter.get(
  "/admin/get-specific-policies/:id",
  auth,
  getSpecificPolicies
);
policiesRouter.post("/admin/update-policies/:id", auth, updatePolicies);
policiesRouter.post(
  "/admin/delete-multiple-policies",
  auth,
  delMultiplePolicies
);

module.exports = policiesRouter;
