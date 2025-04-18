const connection = require("../config/db");
const {
  PAYMOB_API_URL,
  PAYMOB_API_KEY,
  PAYMOB_INTEGRATION_ID,
} = require("../global");
const sendEmail = require("../utils/sendEmail");
const axios = require("axios");

function query(sql) {
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
}

module.exports.checkoutUserOrder = async (req, res) => {
  const {
    user,
    phone,
    billingAddress,
    shippingAddress,
    orders,
    totalAmount,
    totalSales,
    totalPurchase,
    totalDiscount,
    type,
    paymentStatus,
  } = req.body.data;

  try {
    if (type === "paymob") {
      const authResponse = await axios.post(`${PAYMOB_API_URL}/auth/tokens`, {
        api_key: PAYMOB_API_KEY,
      });

      // if (authResponse.status !== 200 || authResponse.status !== 201) {
      //   throw new Error("Failed to call the Auth API");
      // }

      const auth_token = authResponse.data.token;
      // console.log("authehe", authResponse);

      const productDetails = orders.map((order) => ({
        name: order?.product?.title,
        quantity: order.quantity + "",
        description: order?.product?.description,
        amount_cents: order?.variant?.price * 100,
      }));

      const orderResponse = await axios.post(
        `${PAYMOB_API_URL}/ecommerce/orders`,
        {
          auth_token: auth_token,
          delivery_needed: "false",
          amount_cents: `${totalAmount * 100}`,
          currency: "PKR",

          items: productDetails,
        }
      );
      //console.log("hi you", orderResponse);

      // if (orderResponse.status !== 200 || orderResponse.status !== 201) {
      //   throw new Error("Failed to call the Order API");
      // }

      const paymentTokenResponse = await axios.post(
        `${PAYMOB_API_URL}/acceptance/payment_keys`,

        {
          auth_token: auth_token,
          amount_cents: orderResponse?.data?.amount_cents,
          expiration: 3600,
          order_id: orderResponse?.data?.id,
          billing_data: {
            apartment: "NA",
            email: "NA",
            floor: "NA",
            first_name: "Clifford",
            street: "NA",
            building: "NA",
            phone_number: "+86(8)9135210487",
            shipping_method: "NA",
            postal_code: "NA",
            city: "NA",
            country: "NA",
            last_name: "Nicolas",
            state: "NA",
          },
          currency: "PKR",
          integration_id: PAYMOB_INTEGRATION_ID,
          lock_order_when_paid: "false",
        }
      );

      // if (orderResponse.status !== 200 || orderResponse.status !== 201) {
      //   throw new Error("Failed to call the Order API");
      // }
      return res.status(200).json({
        success: {
          paymentLinkToken: paymentTokenResponse?.data?.token,
        },
      });
    }
    const updateUser = `UPDATE users SET phone = "${phone}", shipping_address1 = "${shippingAddress}", billing_address1 = "${billingAddress}"  where id = ${user}`;
    connection.query(updateUser, async function (err, result) {
      if (err) {
        console.error("Error updating user:", err);
        return res.status(500).json({ error: { msg: "Error updating user" } });
      }

      const otp = Math.floor(100000 + Math.random() * 900000);

      const inserUserOrder = `INSERT INTO user_orders (user_id, total_purchase, total_sales, total_discount, total_amount, payment_otp, status,payment_method,billing_address,shipping_address,payment_status,contact) VALUES (${user}, ${totalPurchase}, ${totalSales}, ${totalDiscount}, ${totalAmount}, "${otp}", "pending","${type}","${billingAddress}","${shippingAddress}",${paymentStatus},"${phone}")`;
      connection.query(inserUserOrder, function (err, resultUserOrder) {
        if (err) {
          console.error("Error inserting user order:", err);
          return res
            .status(500)
            .json({ error: { msg: "Error creating order" } });
        }

        if (orders?.length > 0) {
          orders.forEach((order) => {
            const inserUserOrderProduct = `INSERT INTO user_order_products (order_id, virtual_id, product_id, varient_id, quantity, purchase_price, price, discount, total_amount) VALUES (${
              resultUserOrder?.insertId
            }, ${order.id}, ${order.product.id}, ${order.variant.id}, ${
              order.quantity
            }, ${order.variant.purchase_price}, ${order.variant.price}, ${
              order.variant.discount
            }, ${
              (order.variant.price - order.variant.discount) * order.quantity
            })`;
            connection.query(
              inserUserOrderProduct,
              async function (err, resultUserOrderProduct) {
                if (err) {
                  console.error("Error inserting user order product:", err);
                } else {
                  const updateProductQuantity = `UPDATE varients SET quantity = quantity - ${order.quantity} WHERE id = ${order.variant.id}`;
                  await query(updateProductQuantity);
                }
              }
            );
          });
        }

        const delCategory = `UPDATE user_cart SET is_remove = ${true} where user_id = ${user}`;

        connection.query(delCategory, function (err, result) {
          if (err) {
            console.error("Error updating user cart:", err);
            return res
              .status(500)
              .json({ error: { msg: "Error updating cart" } });
          }

          return res.status(200).json({
            success: {
              msg: "Order added successfully!",
              orderId: resultUserOrder?.insertId,
              paymentLinkToken:
                type === "paymob" ? paymentTokenResponse?.data?.token : null,
            },
          });
        });
      });
    });
  } catch (error) {
    console.error("Uncatchable Error:", error);
    return res
      .status(500)
      .json({ error: { msg: "Uncatchable Error Occurred" } });
  }
};

// module.exports.checkoutUserOrder = async (req, res) => {
//   const {
//     user,
//     phone,
//     billingAddress,
//     shippingAddress,
//     orders,
//     totalAmount,
//     totalSales,
//     totalPurchase,
//     totalDiscount,
//   } = req.body.data;

//   // const { cardNumber, email, cvc, expiry, nameOnCard } = req.body.paymentData;

//   try {
//     const authResponse = await axios.post(`${PAYMOB_API_URL}/auth/tokens`, {
//       api_key: PAYMOB_API_KEY,
//     });

//     // if (authResponse.status !== 200 || authResponse.status !== 201) {
//     //   throw new Error("Failed to call the Auth API");
//     // }

//     const auth_token = authResponse.data.token;
//     // console.log("authehe", authResponse);

//     const productDetails = orders.map((order) => ({
//       name: order?.product?.title,
//       quantity: order.quantity + "",
//       description: order?.product?.description,
//       amount_cents: order?.variant?.price * 100,
//     }));

//     const orderResponse = await axios.post(
//       `${PAYMOB_API_URL}/ecommerce/orders`,
//       {
//         auth_token: auth_token,
//         delivery_needed: "false",
//         amount_cents: `${totalAmount * 100}`,
//         currency: "PKR",

//         items: productDetails,
//       }
//     );
//     //console.log("hi you", orderResponse);

//     // if (orderResponse.status !== 200 || orderResponse.status !== 201) {
//     //   throw new Error("Failed to call the Order API");
//     // }

//     const paymentTokenResponse = await axios.post(
//       `${PAYMOB_API_URL}/acceptance/payment_keys`,

//       {
//         auth_token: auth_token,
//         amount_cents: orderResponse?.data?.amount_cents,
//         expiration: 3600,
//         order_id: orderResponse?.data?.id,
//         billing_data: {
//           apartment: "NA",
//           email: "NA",
//           floor: "NA",
//           first_name: "Clifford",
//           street: "NA",
//           building: "NA",
//           phone_number: "+86(8)9135210487",
//           shipping_method: "NA",
//           postal_code: "NA",
//           city: "NA",
//           country: "NA",
//           last_name: "Nicolas",
//           state: "NA",
//         },
//         currency: "PKR",
//         integration_id: PAYMOB_INTEGRATION_ID,
//         lock_order_when_paid: "false",
//       }
//     );

//     // if (orderResponse.status !== 200 || orderResponse.status !== 201) {
//     //   throw new Error("Failed to call the Order API");
//     // }

//     const updateUser = `UPDATE users SET phone = "${phone}", shipping_address1 = "${shippingAddress}", billing_address1 = "${billingAddress}"  where id = ${user}`;
//     connection.query(updateUser, async function (err, result) {
//       if (err) throw err;

//       const otp = Math.floor(100000 + Math.random() * 900000);

//       // await sendEmail(
//       //   email,
//       //   "Verify Payment",
//       //   `Your OTP for payment verification is ${otp}`
//       // );

//       const inserUserOrder = `INSERT INTO user_orders ( user_id, total_purchase, total_sales, total_discount, total_amount, payment_otp) VALUES (${user}, ${totalPurchase}, ${totalSales}, ${totalDiscount}, ${totalAmount}, "${otp}")`;
//       connection.query(inserUserOrder, function (err, resultUserOrder) {
//         if (err) throw err;

//         if (orders?.length > 0) {
//           orders.map((order, index) => {
//             const inserUserOrderProduct = `INSERT INTO user_order_products ( order_id, virtual_id, product_id, varient_id, quantity, purchase_price, price, discount, total_amount) VALUES (${
//               resultUserOrder?.insertId
//             }, ${index}, ${order?.product?.id}, ${order?.variant?.id}, ${
//               order?.quantity
//             }, ${order?.variant?.purchase_price}, ${order?.variant?.price}, ${
//               order?.variant?.discount
//             }, ${
//               (order?.variant?.price - order?.variant?.discount) *
//               order?.quantity
//             })`;
//             connection.query(
//               inserUserOrderProduct,
//               async function (err, resultUserOrderProduct) {
//                 if (err) throw err;

//                 const updateProductQuantity = `UPDATE varients SET quantity = quantity - ${order.quantity} WHERE id = ${order?.variant?.id}`;
//                 await query(updateProductQuantity);
//               }
//             );
//           });
//         }

//         const delCategory = `UPDATE user_cart SET is_remove = ${true} where user_id = ${user}`;
//         connection.query(delCategory, function (err, result) {
//           if (err) throw err;
//           // const inserUserCard = `INSERT INTO user_credit_cards ( user_id, name, number, email, expiry, cvc) VALUES (${user}, "${nameOnCard}", "${cardNumber}", "${email}", "${expiry}", "${cvc}")`;
//           // connection.query(inserUserCard, async function (err, result) {
//           //   if (err) throw err;

//           return res.status(200).json({
//             success: {
//               msg: "Order added successfully!",
//               orderId: resultUserOrder?.insertId,
//               paymentLinkToken: paymentTokenResponse?.data?.token,
//             },
//           });
//         });
//       });
//     });
//     // });
//   } catch (error) {
//     return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
//   }
// };

module.exports.verifyPayment = async (req, res) => {
  const { otp, orderId } = req.body;

  try {
    const getOtp = `SELECT payment_otp FROM user_orders WHERE id = ${orderId}`;

    connection.query(getOtp, async function (err, result) {
      if (err) throw err;

      if (
        result?.length > 0 &&
        result[0]?.payment_otp &&
        result[0]?.payment_otp === otp
      ) {
        const updatePayment = `UPDATE user_orders SET payment_status = ${true} where id = ${orderId}`;
        connection.query(updatePayment, function (err, result) {
          if (err) throw err;

          return res.status(200).json({
            success: {
              msg: "Order Checkout successfully!",
            },
          });
        });
      } else {
        return res.status(400).json({
          error: {
            msg: "Incorrect OTP!",
          },
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
