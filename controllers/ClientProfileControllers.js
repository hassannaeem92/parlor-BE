const connection = require("../config/db");

module.exports.getSpecificUser = async (req, res) => {
  const { id } = req.params;
  try {
    const getCategory = `SELECT * FROM users WHERE id = ?`;
    connection.query(getCategory, [id], function (err, result) {
      if (err) {
        console.error("Error while fetching user:", err);
        return res
          .status(500)
          .json({ error: { msg: "An error occurred while fetching user" } });
      }

      return res.status(200).json(result[0]);
    });
  } catch (error) {
    console.error("Uncatchable error occurred:", error);
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.updateUser = async (req, res) => {
  const {
    fname,
    lname,
    email,
    isActive,
    userId,
    phone,
    shipping_address1,
    billing_address1,
    country,
    state,
    city,
    zip,
    apt,
    street,
    ccv,
    expiryDate,
    cardName,
    cardNumber,
  } = req.body;
  const { id } = req.params;

  try {
    const updateCategory = `
      UPDATE users 
      SET name = ?, last_name = ?, email = ?,
          phone = ?, shipping_address1 = ?, billing_address1 = ?,country=?,city=?,state=?,street=?,zip_code=?,apt=?,ccv=?,expire_date=?,card_name=?,card_number=?
      WHERE id = ?
    `;
    const values = [
      fname,
      lname,
      email,
      phone,
      shipping_address1,
      billing_address1,

      country,
      city,
      state,
      street,
      zip,
      apt,
      ccv,
      expiryDate,
      cardName,
      cardNumber,
      id,
    ];

    connection.query(updateCategory, values, function (err, result) {
      if (err) {
        console.error("Error while updating user:", err);
        return res
          .status(500)
          .json({ error: { msg: "An error occurred while updating user" } });
      }

      return res
        .status(200)
        .json({ success: { msg: "User updated Successfully!" } });
    });
  } catch (error) {
    console.error("Uncatchable error occurred:", error);
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.updateUserPic = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: { msg: "No file uploaded" } });
  }

  const img = req.file.filename;
  const { id } = req.params;

  try {
    const imgQuery = `UPDATE users SET image = ? WHERE id = ?`;
    connection.query(imgQuery, [img, id], (err, result) => {
      if (err) {
        console.error("Error updating user image:", err);
        return res
          .status(500)
          .json({ error: { msg: "Error uploading image" } });
      } else {
        return res
          .status(200)
          .json({ success: { msg: "Image uploaded successfully" } });
      }
    });
  } catch (error) {
    console.error("Uncaught error in updateUserPic:", error);
    return res
      .status(500)
      .json({ error: { msg: "An unexpected error occurred" } });
  }
};










