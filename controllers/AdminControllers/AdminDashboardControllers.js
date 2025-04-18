const connection = require("../../config/db");
const env = require("../../global");

module.exports.getDashboardCount = async (req, res) => {
  try {
    const getSubCategoryQuery = `   
    SELECT 
    (SELECT COUNT(*) FROM products WHERE is_deleted=${false}) AS total_products,
    (SELECT COUNT(*) FROM products WHERE is_deleted=${false} AND is_active=${true}) AS total_active_products,
    (SELECT SUM(purchase_price) FROM products WHERE is_deleted=${false}) AS total_purchase,
    (SELECT COUNT(*) FROM user_orders WHERE is_delete=${false}) AS total_orders,
    (SELECT COUNT(*) FROM user_orders WHERE is_delete=${false} AND status = "pending") AS total_pending_orders,
    (SELECT COUNT(*) FROM user_orders WHERE is_delete=${false} AND status = "proceed") AS total_proceed_orders,
    (SELECT COUNT(*) FROM user_orders WHERE is_delete=${false} AND status = "delivered") AS total_delivered_orders,
    (SELECT SUM(total_amount) FROM user_orders WHERE is_delete=${false}) AS total_sales_amount,
    (SELECT COUNT(*) FROM categories WHERE is_delete=${false}) AS total_categories,
    (SELECT COUNT(*) FROM sub_categories WHERE is_delete=${false}) AS total_subcategories,
    (SELECT SUM(total_amount) AS current_date_sales FROM user_orders WHERE DATE(created_at) = CURDATE() AND is_delete=${false}) AS current_date_sales,
    (SELECT SUM(total_amount) AS current_month_sales FROM user_orders WHERE MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE()) AND is_delete=${false}) AS current_month_sales
  `;

    connection.query(getSubCategoryQuery, function (err, result) {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: { msg: "Internal Server Error" } });
      }

      return res.status(200).json(result[0]);
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: { msg: "Uncatchable Error Occurred" } });
  }
};

module.exports.getDashboardChartData = async (req, res) => {
  try {
    const getSubCategoryQuery = `   
    SELECT YEAR(created_at) AS sale_year, 
       MONTH(created_at) AS sale_month, 
       SUM(total_amount) AS total_sales, 
       SUM(CASE WHEN status = 'proceed' THEN total_amount ELSE 0 END) AS total_proceed, 
       SUM(CASE WHEN status = 'delivered' THEN total_amount ELSE 0 END) AS total_delivered, 
       SUM(CASE WHEN status = 'pending' THEN total_amount ELSE 0 END) AS total_pending
FROM user_orders 
WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH) 
      AND is_delete = ${false} 
GROUP BY YEAR(created_at), MONTH(created_at) 
ORDER BY sale_year DESC, sale_month DESC;
  `;

    connection.query(getSubCategoryQuery, function (err, result) {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: { msg: "Internal Server Error" } });
      }

      return res.status(200).json(result);
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: { msg: "Uncatchable Error Occurred" } });
  }
};

// SELECT
//     (SELECT COUNT(*) FROM products WHERE is_deleted=${false}) AS total_products,
//     (SELECT COUNT(*) FROM products WHERE is_deleted=${false} AND is_active=${true}) AS total_active_products,
//     (SELECT SUM(purchase_price) FROM products WHERE is_deleted=${false}) AS total_purchase,
//     (SELECT COUNT(*) FROM sales WHERE is_delete=${false}) AS total_sales,
//     (SELECT COUNT(*) FROM categories WHERE is_delete=${false}) AS total_categories,
//     (SELECT COUNT(*) FROM sub_categories WHERE is_delete=${false}) AS total_subcategories,
//     (SELECT SUM(total_amount) AS current_date_sales FROM sales WHERE DATE(created_at) = CURDATE() AND is_delete=${false}) AS current_date_sales,
//     (SELECT SUM(total_amount) AS current_date_refunds FROM sales WHERE DATE(created_at) = CURDATE() AND is_delete=${false} AND status="refund") AS current_date_refunds,
//     (SELECT SUM(total_amount) AS current_date_invoice FROM sales WHERE DATE(created_at) = CURDATE() AND is_delete=${false} AND status="invoice") AS current_date_invoice,
//     (SELECT SUM(total_discount) AS current_date_discount FROM sales WHERE DATE(created_at) = CURDATE() AND is_delete=${false}) AS current_date_discount,
//     (SELECT SUM(total_amount) AS current_month_sales FROM sales WHERE MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE()) AND is_delete=${false}) AS current_month_sales,
//     (SELECT SUM(total_amount) AS current_month_invoice FROM sales WHERE MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE()) AND is_delete=${false} AND status="invoice") AS current_month_invoice,
//     (SELECT SUM(total_amount) AS current_month_refunds FROM sales WHERE MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE()) AND is_delete=${false} AND status="refund") AS current_month_refunds,
//     (SELECT SUM(total_discount) AS current_month_discount FROM sales WHERE MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE()) AND is_delete=${false}) AS current_month_discount
