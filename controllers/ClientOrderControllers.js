const connection = require("../config/db");
const env = require("../global");

module.exports.getOrders = async (req, res) => {
  const { id } = req.params;
  try {
    const getOrderQuery = `
            SELECT 
              o.id,
              o.vat_per,
              o.user_id,
              o.vat_amount,
              o.total_purchase,
              o.total_sales,
              o.total_discount,
              o.total_amount,
              o.status,
              o.contact,
              o.billing_address,
              o.shipping_address,
              o.payment_status,
              o.payment_method,
              o.is_active,
              o.created_at,
              o.updated_at
            FROM 
              user_orders o       
            WHERE 
              o.user_id = ${id} AND o.is_delete = ${false} ORDER BY o.created_at DESC;
          `;

    connection.query(getOrderQuery, async (err, orders) => {
      if (err) throw err;

      for (let i = 0; i < orders?.length; i++) {
        const orderId = orders[i].id;
        const getOrderProductQuery = `
                SELECT
                o.virtual_id AS id,
                o.product_id AS product,
                o.varient_id AS varient,
                o.purchase_price AS purchasePrice,
                o.price AS salePrice,
                o.discount,
                o.quantity,
                o.discount_value,
                o.is_discount_percentage,
                o.total_amount AS total,
                p.title,
                p.description,
                p.id as product_id
                FROM 
                  user_order_products o
                JOIN 
                products p on p.id=o.product_id
                WHERE 
                  o.order_id = ${orderId};
              `;

        // Execute the query to get variants for the current product
        const orderProducts = await new Promise((resolve, reject) => {
          connection.query(getOrderProductQuery, (err, result) => {
            if (err) reject(err);

            resolve(result);
          });
        });

        //Add Product Image
        for (let i = 0; i < orderProducts?.length; i++) {
          const productId = orderProducts[i].product_id;
          const productImgQuery = `SELECT * FROM product_images WHERE product_id = ${productId} AND is_delete = ${false}`;
          const productImgResult = await new Promise((resolve, reject) => {
            connection.query(productImgQuery, (err, product) => {
              if (err) reject(err);
              else resolve(product[0]);
            });
          });
          orderProducts[i].product_img = productImgResult;

          orderProducts[i].image_path =
            env.ADMIN_BACKEND_URL + "product_images/";
        }

        // Add the processed prdoucts to the current order
        orders[i].products = orderProducts;
      }
      return res.status(200).json(orders);
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: { msg: "Uncatchable Error Occurred" } });
  }
};
