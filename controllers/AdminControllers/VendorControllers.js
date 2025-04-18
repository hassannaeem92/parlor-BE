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

module.exports.getVendors = async (req, res) => {
  try {
    const getCategory = `SELECT * FROM vendors where is_delete = ${false} ORDER BY created_at DESC`;
    connection.query(getCategory, function (err, result) {
      if (err) throw err;

      return res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.delMultipleVendors = async (req, res) => {
  const vendorIds = req.body;
  const idString = vendorIds.join(",");

  try {
    // Check if there are any purchases associated with the vendors
    const checkPurchasesQuery = `SELECT DISTINCT vendor_id FROM purchase_orders WHERE vendor_id IN (${idString}) AND is_delete = ${false}`;
    const vendorsWithPurchases = await query(checkPurchasesQuery);

    if (vendorsWithPurchases.length > 0) {
      return res.status(400).json({
        error: { msg: "Cannot delete vendors with existing purchases." },
      });
    }

    const deleteVendorsQuery = `UPDATE vendors SET is_delete = ${true} WHERE id IN (${idString})`;
    await query(deleteVendorsQuery);

    return res.status(200).json({
      success: { msg: "Selected vendors deleted successfully!" },
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.addVendor = async (req, res) => {
  const {
    name,
    phone,
    email,
    status,
    phone2,
    address1,
    address2,
    country,
    state,
    city,
    latitude,
    longitude,
    telephone,
    fax,
  } = req.body;

  try {
    const inserUser = `INSERT INTO vendors ( name, email, phone, phone2, telephone, fax, latitude, longitude, address1, address2, country, state, city,  is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
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
        country,
        state,
        city,
        status,
      ],
      function (err, resultUser) {
        return res.status(200).json({
          success: {
            msg: "Vendor Added Successfully!",
          },
        });
      }
    );
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.getSpecificVendor = async (req, res) => {
  const { id } = req.params;
  try {
    const getCategory = `SELECT * FROM vendors where id = ${id}`;
    connection.query(getCategory, function (err, result) {
      if (err) throw err;

      return res.status(200).json(result[0]);
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.updateVendor = async (req, res) => {
  const {
    name,
    phone,
    email,
    status,
    phone2,
    address1,
    address2,
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
    const insertCategory = `UPDATE vendors SET 
    name = ?, 
    phone = ?, 
    email = ?, 
    is_active = ?,
    phone2 = ?,
    address1 = ?,
    address2 = ?,
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
          .json({ success: { msg: "vendor updated Successfully!" } });
      }
    );
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};
