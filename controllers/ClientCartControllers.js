const connection = require("../config/db");
const env = require("../global");

module.exports.addItemToCart = async (req, res) => {
  const { product, varient, qty, user } = req.body;
  try {
    const checkUserCartAvailable = `SELECT * FROM user_cart WHERE product_id = ${product} and varient_id=${varient} AND is_remove = ${false}`;
    connection.query(checkUserCartAvailable, function (err, resultCheck) {
      if (err) throw err;

      if (resultCheck?.length > 0) {
        const updateCart = `UPDATE user_cart SET quantity=${
          resultCheck[0]?.quantity + 1
        } WHERE id = ${resultCheck[0]?.id}`;
        connection.query(updateCart, function (err, resultUpdate) {
          if (err) throw err;

          return res
            .status(200)
            .json({ success: { msg: "Item added to Cart Successfully!" } });
        });
      } else {
        const insertCategory = `INSERT INTO user_cart ( user_id, product_id, varient_id, quantity) VALUES (${user}, ${product}, ${varient}, ${qty})`;
        connection.query(insertCategory, function (err, result) {
          if (err) throw err;

          return res
            .status(200)
            .json({ success: { msg: "Item added to Cart Successfully!" } });
        });
      }
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.getUserCartItem = async (req, res) => {
  const { id } = req.params;

  try {
    const getCart = `SELECT * FROM user_cart WHERE is_remove = ${false} AND user_id = ${id}`;

    connection.query(getCart, async function (err, result) {
      if (err) throw err;

      try {
        for (let i = 0; i < result?.length; i++) {
          const productId = result[i].product_id;
          const variantId = result[i].varient_id;

          // Fetch product details
          const productQuery = `SELECT * FROM products WHERE id = ${productId}`;
          const productResult = await new Promise((resolve, reject) => {
            connection.query(productQuery, (err, product) => {
              if (err) reject(err);
              else resolve(product[0]);
            });
          });
          result[i].product = productResult;

          // Fetch product details
          const productImgQuery = `SELECT * FROM product_images WHERE product_id = ${productId} AND is_delete = ${false}`;
          const productImgResult = await new Promise((resolve, reject) => {
            connection.query(productImgQuery, (err, product) => {
              if (err) reject(err);
              else resolve(product[0]);
            });
          });
          result[i].product_img = productImgResult;

          result[i].image_path = env.ADMIN_BACKEND_URL + "product_images/";

          // Fetch variant details
          const variantQuery = `SELECT * FROM varients WHERE id = ${variantId}`;
          const variantResult = await new Promise((resolve, reject) => {
            connection.query(variantQuery, (err, variant) => {
              if (err) reject(err);
              else resolve(variant[0]);
            });
          });
          result[i].variant = variantResult;
        }

        return res.status(200).json(result);
      } catch (error) {
        console.error("Error fetching product or variant details:", error);
        return res.status(500).json({
          error: { msg: "Error fetching product or variant details" },
        });
      }
    });
  } catch (error) {
    console.error("Error retrieving user cart items:", error);
    return res
      .status(500)
      .json({ error: { msg: "Uncatchable Error Occurred" } });
  }
};

module.exports.removeUserCartItem = async (req, res) => {
  const { id } = req.params;

  try {
    const delCategory = `UPDATE user_cart SET is_remove = ${true} where id = ${id}`;
    connection.query(delCategory, function (err, result) {
      if (err) throw err;

      return res
        .status(200)
        .json({ success: { msg: "Cart item remove Successfully!" } });
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.increaseUserCartItemQty = async (req, res) => {
  const { id } = req.params;

  try {
    const delCategory = `UPDATE user_cart SET quantity = quantity + 1 where id = ${id}`;
    connection.query(delCategory, function (err, result) {
      if (err) throw err;

      return res
        .status(200)
        .json({ success: { msg: "Cart qty increase Successfully!" } });
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.decreaseUserCartItemQty = async (req, res) => {
  const { id } = req.params;

  try {
    const checkUserCartAvailable = `SELECT * FROM user_cart WHERE id = ${id} AND is_remove = ${false}`;
    connection.query(checkUserCartAvailable, function (err, resultCheck) {
      if (err) throw err;

      if (resultCheck?.length > 0) {
        const currentQuantity = resultCheck[0].quantity;

        if (currentQuantity > 1) {
          const delCategory = `UPDATE user_cart SET quantity = quantity - 1 where id = ${id}`;
          connection.query(delCategory, function (err, result) {
            if (err) throw err;

            return res
              .status(200)
              .json({ success: { msg: "Cart qty decrease Successfully!" } });
          });
        } else {
          const delCategory = `UPDATE user_cart SET is_remove = ${true} where id = ${id}`;
          connection.query(delCategory, function (err, result) {
            if (err) throw err;

            return res
              .status(200)
              .json({ success: { msg: "Cart qty decrease Successfully!" } });
          });
        }
      }
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};
