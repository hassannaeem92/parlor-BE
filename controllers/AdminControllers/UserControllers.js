const connection = require("../../config/db");
const env = require("../../global");
const crypto = require("crypto");
const sendEmail = require("../../utils/sendEmail");

module.exports.addUser = async (req, res) => {
  const { fname, lname, email, isActive, userId } = req.body;

  try {
    const checkUserAvailable = `SELECT * FROM admin_users WHERE email = \"${email}\"`;
    connection.query(checkUserAvailable, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return;
      }
      if (results?.length > 0) {
        return res.status(400).json({ error: { msg: "Email already taken" } });
      } else {
        const inserUser = `INSERT INTO admin_users ( first_name, last_name, email, is_active, created_by, updated_by) VALUES (\"${fname}\", \"${lname}\", \"${email}\", ${isActive}, ${userId}, ${userId})`;
        connection.query(inserUser, function (err, resultUser) {
          if (err) throw err;
          const token = crypto.randomBytes(32).toString("hex");

          const insertToken = `INSERT INTO admin_user_token ( user_id, token) VALUES (${resultUser.insertId}, \"${token}\")`;
          connection.query(insertToken, async function (err, resultToken) {
            if (err) throw err;
            const url = `${env.ADMIN_URL}users/${resultUser.insertId}/set-new-password/${token}`;
            const emailRes = await sendEmail(email, "Set new Password", url);

            if (emailRes) {
              return res.status(200).json({
                success: {
                  msg: "User added and Email send to user Successfully!",
                },
              });
            } else {
              return res.status(422).json({
                warning: {
                  msg: "User added but failed to send Email to user",
                },
              });
            }
          });
        });
      }
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.getUsers = async (req, res) => {
  try {
    const getCategory = `SELECT * FROM admin_users where is_delete = ${false} ORDER BY created_at DESC`;
    connection.query(getCategory, function (err, result) {
      if (err) throw err;

      return res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.delMultipleUsers = async (req, res) => {
  const userIds = req.body;
  const idString = userIds.join(",");

  try {
    const insertCategory = `UPDATE admin_users SET is_delete = ${true} where id IN (${idString})`;
    connection.query(insertCategory, function (err, result) {
      if (err) throw err;

      return res.status(200).json({
        success: { msg: "Selected users deleted Successfully!" },
      });
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.getSpecificUser = async (req, res) => {
  const { id } = req.params;
  try {
    const getCategory = `SELECT * FROM admin_users where id = ${id}`;
    connection.query(getCategory, function (err, result) {
      if (err) throw err;

      return res.status(200).json(result[0]);
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.updateUser = async (req, res) => {
  const { fname, lname, email, isActive, userId } = req.body;
  const { id } = req.params;
  try {
    const insertCategory = `UPDATE admin_users SET first_name = \"${fname}\", last_name = \"${lname}\", email = \"${email}\", is_active = ${isActive}, updated_by = ${userId} where id = ${id}`;
    connection.query(insertCategory, function (err, result) {
      if (err) throw err;

      return res
        .status(200)
        .json({ success: { msg: "User updated Successfully!" } });
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};
