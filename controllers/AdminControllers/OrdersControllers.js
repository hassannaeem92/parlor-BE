const connection = require("../../config/db");
const env = require("../../global");
function query(sql) {
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
}

module.exports.getOrders = async (req, res) => {
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
            o.payment_method,
            o.payment_status,
            o.is_active,
            o.created_at,
            o.updated_at,
            u.name,
            u.phone   
          FROM 
            user_orders o
          JOIN 
            users u ON o.user_id = u.id       
          WHERE 
            o.is_delete = ${false} AND u.is_delete=${false} ORDER BY o.created_at DESC;
        `;

    connection.query(getOrderQuery, async (err, orders) => {
      if (err) throw err;

      for (let i = 0; i < orders?.length; i++) {
        const orderId = orders[i].id;
        const getOrderProductQuery = `
              SELECT
              virtual_id AS id,
              product_id AS product,
              varient_id AS varient,
              purchase_price AS purchasePrice,
              price AS salePrice,
              discount,
              quantity,
              discount_value,
              is_discount_percentage,
              total_amount AS total
              FROM 
                user_order_products
              WHERE 
                order_id = ${orderId};
            `;

        // Execute the query to get variants for the current product
        const orderProducts = await new Promise((resolve, reject) => {
          connection.query(getOrderProductQuery, (err, result) => {
            if (err) reject(err);

            resolve(result);
          });
        });

        // Add the processed variants to the current product
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

module.exports.getSpecificOrders = async (req, res) => {
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
            o.is_active,
            o.created_at,
            o.updated_at,
            u.name,
            u.phone   
          FROM 
            user_orders o
          JOIN 
            users u ON o.user_id = u.id       
          WHERE 
          o.id = ${id};
        `;

    connection.query(getOrderQuery, async (err, orders) => {
      if (err) throw err;

      for (let i = 0; i < orders?.length; i++) {
        const orderId = orders[i].id;
        const getOrderProductQuery = `
              SELECT
              o.id AS order_product_id,
              o.virtual_id AS id,
              o.product_id AS product,
              o.varient_id AS varient,
              o.purchase_price AS purchasePrice,
              o.price AS salePrice,
              o.discount,
              o.quantity,
              o.discount_value,
              o.is_discount_percentage,
              o.total_amount AS total
              FROM 
                user_order_products o
              JOIN
               products p ON p.id = o.product_id
              WHERE 
                o.order_id = ${orderId} AND p.is_deleted=${false};
            `;

        // Execute the query to get variants for the current product
        const orderProducts = await new Promise((resolve, reject) => {
          connection.query(getOrderProductQuery, (err, result) => {
            if (err) reject(err);

            resolve(result);
          });
        });

        // Add the processed variants to the current product
        orders[i].products = orderProducts;
      }

      return res.status(200).json(orders[0]);
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: { msg: "Uncatchable Error Occurred" } });
  }
};

module.exports.changeOrderStatus = async (req, res) => {
  const { status, orders } = req.body;
  const idString = orders.join(",");
  console.log(idString);

  try {
    const insertCategory = `UPDATE user_orders SET status = "${status}" where id IN (${idString})`;
    connection.query(insertCategory, function (err, result) {
      if (err) throw err;

      return res.status(200).json({
        success: { msg: "Selected orders status change Successfully!" },
      });
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};
module.exports.changeOrderPaymentStatus = async (req, res) => {
  const { status, orders } = req.body;
  const idString = orders.join(",");
  console.log(idString);

  try {
    const query = `UPDATE user_orders SET payment_status = ${status} where id IN (${idString})`;
    connection.query(query, function (err, result) {
      if (err) throw err;

      return res.status(200).json({
        success: {
          msg: "Selected orders payment status changed Successfully!",
        },
      });
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.addOrder = async (req, res) => {
  try {
    const {
      name,
      phone,
      customerId,
      status,
      userId,
      products,
      vatNumber,
      totalPurchase,
      totalSales,
      totalDiscount,
      vatPer,
      vatAmount,
      totalAmount,
      saleStatus,
    } = req.body;

    // const currentDate = new Date().toISOString();

    // const generateQrCode = new TT_Zatca.GenerateQrCode(
    //   name,
    //   `${vatNumber}`,
    //   currentDate,
    //   totalAmount,
    //   vatAmount
    // );

    // let qrbase64 = await generateQrCode.toBase64();

    // const getCustomer = `SELECT * FROM users where phone = ${phone}`;
    // const resultCustomer = await query(getCustomer);

    // let customerId = "";

    // if (resultCustomer?.length > 0) {
    //   const updateCustomer = `UPDATE users SET name = "${name}" WHERE id = ${resultCustomer[0].id}`;
    //   await query(updateCustomer);
    //   customerId = resultCustomer[0].id;
    // } else {
    //   const insertCustomer = `INSERT INTO users (name, phone) VALUES ("${name}", "${phone}")`;
    //   const resultInsertCustomer = await query(insertCustomer);
    //   customerId = resultInsertCustomer.insertId;
    // }

    const insertSales = `INSERT INTO user_orders ( user_id, vat_per, vat_amount, total_purchase, total_sales, total_discount, total_amount) VALUES (${customerId}, ${vatPer}, ${vatAmount}, ${totalPurchase}, ${totalSales}, ${totalDiscount}, ${totalAmount})`;

    const saleResult = await query(insertSales);

    for (const product of products) {
      const insertSaleProduct = `INSERT INTO user_order_products ( order_id, virtual_id, product_id, varient_id, quantity, purchase_price, price, discount, total_amount) VALUES (${saleResult?.insertId}, ${product?.id}, ${product?.product}, ${product?.varient}, ${product?.quantity}, ${product?.purchasePrice}, ${product?.salePrice}, ${product?.discount}, ${product?.total})`;
      await query(insertSaleProduct);

      if (saleStatus === "refund") {
        // If saleStatus is 'refund', add the quantity back to the product
        const updateProductQuantity = `UPDATE varients SET quantity = quantity + ${product.quantity} WHERE id = ${product.varient}`;
        await query(updateProductQuantity);
      } else {
        // Otherwise, subtract the quantity from the product
        const updateProductQuantity = `UPDATE varients SET quantity = quantity - ${product.quantity} WHERE id = ${product.varient}`;
        await query(updateProductQuantity);
      }
    }

    return res.status(200).json({
      success: { msg: "Orders added Successfully!" },
      insertSaleId: saleResult.insertId,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.updateOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const {
      name,
      phone,
      customerId,
      status,
      userId,
      products,
      vatNumber,
      totalPurchase,
      totalSales,
      totalDiscount,
      vatPer,
      vatAmount,
      totalAmount,
      saleStatus,
    } = req.body;

    // const getCustomer = `SELECT * FROM users where phone = ${phone}`;
    // const resultCustomer = await query(getCustomer);

    // let customerId = "";

    // if (resultCustomer?.length > 0) {
    //   const updateCustomer = `UPDATE users SET name = "${name}" WHERE id = ${resultCustomer[0].id}`;
    //   await query(updateCustomer);
    //   customerId = resultCustomer[0].id;
    // } else {
    //   const insertCustomer = `INSERT INTO users (name, phone) VALUES ("${name}", "${phone}")`;
    //   const resultInsertCustomer = await query(insertCustomer);
    //   customerId = resultInsertCustomer.insertId;
    // }

    const insertSales = `UPDATE user_orders SET user_id = ${customerId}, vat_per=${vatPer}, vat_amount = ${vatAmount}, total_purchase = ${totalPurchase}, total_sales = ${totalSales}, total_discount = ${totalDiscount}, total_amount = ${totalAmount}  WHERE id = ${id}`;

    const saleResult = await query(insertSales);

    const prevQuantities = {};
    for (const product of products) {
      if (product.order_product_id) {
        const prevQuantityQuery = `SELECT quantity FROM user_order_products WHERE id = ${product.order_product_id}`;
        const prevQuantityResult = await query(prevQuantityQuery);
        prevQuantities[product.order_product_id] =
          prevQuantityResult[0].quantity;
      }
    }

    const deleteSaleProQuery = `DELETE FROM user_order_products WHERE order_id=${id}`;
    connection.query(deleteSaleProQuery, async function (err, deleteResult) {
      if (err) throw err;

      for (const product of products) {
        // Fetch previous quantity from the database

        // Calculate the difference between the previous quantity and the new quantity
        const prevQuantity = prevQuantities[product?.order_product_id] || 0;
        let quantityDifference = 0;

        if (saleStatus === "refund") {
          quantityDifference = product.quantity;
        } else {
          quantityDifference = product.quantity - prevQuantity;
        }
        const insertSaleProduct = `INSERT INTO user_order_products ( id, order_id, virtual_id, product_id, varient_id, quantity, purchase_price, price, discount, discount_value, is_discount_percentage, total_amount ) VALUES (${
          product?.order_product_id ? product?.order_product_id : null
        }, ${id}, ${product.id},  ${product.product}, ${product.varient}, ${
          product.quantity
        }, ${product.purchasePrice}, ${product.salePrice}, ${
          product.discount
        }, ${product.discount_value}, ${product.is_discount_percentage}, ${
          product.total
        } )`;
        await query(insertSaleProduct);

        console.log(quantityDifference);

        if (saleStatus === "refund") {
          // If saleStatus is 'refund', add the quantity back to the product
          const updateProductQuantity = `UPDATE varients SET quantity = quantity + ${quantityDifference} WHERE id = ${product.varient}`;
          await query(updateProductQuantity);
        } else {
          // Otherwise, subtract the quantity from the product
          const updateProductQuantity = `UPDATE varients SET quantity = quantity - ${quantityDifference} WHERE id = ${product.varient}`;
          await query(updateProductQuantity);
        }
      }

      return res
        .status(200)
        .json({ success: { msg: "Order updated Successfully!" } });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.delMultipleOrders = async (req, res) => {
  const orderIds = req.body;
  const idString = orderIds.join(",");

  try {
    const deleteOrder = `UPDATE user_orders SET is_delete = ${true} where id IN (${idString})`;
    connection.query(deleteOrder, function (err, result) {
      if (err) throw err;

      return res.status(200).json({
        success: { msg: "Selected Orders deleted Successfully!" },
      });
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};
