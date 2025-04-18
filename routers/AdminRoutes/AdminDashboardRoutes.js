const app = require("express");
const dashboardRouter = app.Router();

const auth = require("../../utils/auth");

const {
  getDashboardCount,
  getDashboardChartData,
} = require("../../controllers/AdminControllers/AdminDashboardControllers");

dashboardRouter.get("/admin/get-dashboard-count", auth, getDashboardCount);
dashboardRouter.get(
  "/admin/get-dashboard-chart-data",
  auth,
  getDashboardChartData
);

module.exports = dashboardRouter;
