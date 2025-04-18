// index.js
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const connection = require("./config/db");
const authRouter = require("./routers/AuthRoutes");
const adminAuthRouter = require("./routers/AdminRoutes/AdminAuthRoutes");
const categoryRouter = require("./routers/AdminRoutes/CategoryRoutes");
const productRouter = require("./routers/AdminRoutes/ProductRoutes");
const userRouter = require("./routers/AdminRoutes/UserRoutes");
const path = require("path");
const clientProductRouter = require("./routers/ClientProductRoutes");
const clientCartRouter = require("./routers/ClientCartRoutes");
const clientCheckoutRouter = require("./routers/ClientCheckoutRoutes");
const orderRouter = require("./routers/AdminRoutes/OrdersRoutes");
const currencyRouter = require("./routers/AdminRoutes/CurrencyRoutes");
const dashboardRouter = require("./routers/AdminRoutes/AdminDashboardRoutes");
const vendorRouter = require("./routers/AdminRoutes/VendorRoutes");
const customerRouter = require("./routers/AdminRoutes/CustomerRoutes");
const purchaseRouter = require("./routers/AdminRoutes/PurchaseRoutes");
const clientOrderRouter = require("./routers/ClientOrderRoutes");
const env = require("./global");
const faqsRouter = require("./routers/AdminRoutes/FAQsRoutes");
const clientPageRouter = require("./routers/ClientPageRoutes");
const termsRouter = require("./routers/AdminRoutes/TermsRoutes");
const policiesRouter = require("./routers/AdminRoutes/PoliciesRoutes");
const clientContactRouter = require("./routers/ClientContactRoutes");
const clientChargesRouter = require("./routers/ClientChargesRoutes");
const clientProfileRouter = require("./routers/ClientProfileRoutes");
const servicePriceRouter = require("./routers/AdminRoutes/ServicePricesRoutes");
const dealRouter  = require("./routers/AdminRoutes/DealsRoutes");
const homeSectionRouter = require("./routers/HomeSectionRoutes");
const userContactAppointmentRouter  = require("./routers/AdminRoutes/UserContactAppointmentsRoutes");
const HomeSectionAdminRouter = require("./routers/AdminRoutes/HomeSectionAdminRoutes")

const app = express();
connection.connect(function (err) {
  if (err) throw err;
  console.log("Database Connected!");
});

app.use(express.json());
app.use(cors());
// Set up static file serving for the 'product_images' directory
app.use(
  "/product_images",
  express.static(path.join(__dirname, "public/product_images"))
);
app.use(express.static(path.join(__dirname, "public")));

app.use("/", authRouter);
app.use("/", adminAuthRouter);
app.use("/", categoryRouter);
app.use("/", productRouter);
app.use("/", userRouter);
app.use("/", orderRouter);
app.use("/", currencyRouter);
app.use("/", clientProductRouter);
app.use("/", clientCartRouter);
app.use("/", clientCheckoutRouter);
app.use("/", dashboardRouter);
app.use("/", vendorRouter);
app.use("/", customerRouter);
app.use("/", purchaseRouter);
app.use("/", clientOrderRouter);
app.use("/", faqsRouter);
app.use("/", clientPageRouter);
app.use("/", termsRouter);
app.use("/", policiesRouter);
app.use("/", clientContactRouter);
app.use("/", clientChargesRouter);
app.use("/", clientProfileRouter);
app.use("/", servicePriceRouter);
app.use("/", dealRouter);
app.use("/", homeSectionRouter);
app.use("/", userContactAppointmentRouter);
app.use("/", HomeSectionAdminRouter)

app.use(express.static("./public"));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

const PORT = env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
