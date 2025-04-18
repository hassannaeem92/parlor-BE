const connection = require("../../config/db");
const env = require("../../global");
module.exports.getCustomers = async (req, res) => {
  try {
    const getCategory = `SELECT * FROM users where is_delete = ${false} ORDER BY created_at DESC`;
    connection.query(getCategory, function (err, result) {
      if (err) throw err;

      return res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.delMultipleCustomers = async (req, res) => {
  const customerIds = req.body;
  const idString = customerIds.join(",");

  try {
    const insertCategory = `UPDATE users SET is_delete = ${true} where id IN (${idString})`;
    connection.query(insertCategory, function (err, result) {
      if (err) throw err;

      return res.status(200).json({
        success: { msg: "Selected customer deleted Successfully!" },
      });
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.addCustomer = async (req, res) => {
  const {
    name,
    phone,
    email,
    status,
    phone2,
    address1,
    address2,
    shippingAddress1,
    shippingAddress2,
    billingAddress1,
    billingAddress2,
    country,
    state,
    city,
    latitude,
    longitude,
    telephone,
    fax,
  } = req.body;

  try {
    const inserUser = `INSERT INTO users ( name, email, phone, phone2, telephone, fax, latitude, longitude, address1, address2, shipping_address1, shipping_address2, billing_address1, billing_address2, country, state, city,  is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    connection.query(
      inserUser,
      [
        name,
        email,
        phone,
        phone2,
        telephone,
        fax,
        latitude,
        longitude,
        address1,
        address2,
        shippingAddress1,
        shippingAddress2,
        billingAddress1,
        billingAddress2,
        country,
        state,
        city,
        status,
      ],
      function (err, resultUser) {
        return res.status(200).json({
          success: {
            msg: "Customer Added Successfully!",
          },
        });
      }
    );
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.getSpecificCustomer = async (req, res) => {
  const { id } = req.params;
  try {
    const getCategory = `SELECT * FROM users where id = ${id}`;
    connection.query(getCategory, function (err, result) {
      if (err) throw err;

      return res.status(200).json(result[0]);
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.updateCustomer = async (req, res) => {
  const {
    name,
    phone,
    email,
    status,
    phone2,
    address1,
    address2,
    shippingAddress1,
    shippingAddress2,
    billingAddress1,
    billingAddress2,
    country,
    state,
    city,
    latitude,
    longitude,
    telephone,
    fax,
  } = req.body;
  const { id } = req.params;
  try {
    const insertCategory = `UPDATE users SET 
    name = ?, 
    phone = ?, 
    email = ?, 
    is_active = ?,
    phone2 = ?,
    address1 = ?,
    address2 = ?,
    shipping_address1 = ?,
    shipping_address2 = ?,
    billing_address1 = ?,
    billing_address2 = ?,
    country = ?,
    state = ?,
    city = ?,
    latitude = ?,
    longitude = ?,
    telephone = ?,
    fax = ?
    WHERE id = ?`;
    connection.query(
      insertCategory,
      [
        name,
        phone,
        email,
        status,
        phone2,
        address1,
        address2,
        shippingAddress1,
        shippingAddress2,
        billingAddress1,
        billingAddress2,
        country,
        state,
        city,
        latitude,
        longitude,
        telephone,
        fax,
        id,
      ],
      function (err, result) {
        if (err) throw err;

        return res
          .status(200)
          .json({ success: { msg: "customer updated Successfully!" } });
      }
    );
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};
