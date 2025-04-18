const connection = require("../../config/db");
const bcrypt = require("bcryptjs");
const env = require("../../global");
const jwt = require("jsonwebtoken");

const createToken = (user) => {
  return jwt.sign({ user }, env.SECRET, {
    expiresIn: "1d",
  });
};

module.exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const checkUserAvailable = `SELECT * FROM users WHERE email = \"${email}\"`;
    connection.query(checkUserAvailable, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return;
      }
      if (results?.length > 0) {
        return res.status(400).json({ error: { msg: "Email already taken" } });
      } else {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const inserUser = `INSERT INTO admin_users ( name, email, password) VALUES (\"${name}\", \"${email}\", \"${hash}\")`;
        connection.query(inserUser, function (err, resultUser) {
          if (err) throw err;

          return res
            .status(200)
            .json({ success: { msg: "User Register Successfully!" } });
        });
      }
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUserAvailable = `SELECT * FROM admin_users WHERE email = \"${email}\"`;
    connection.query(checkUserAvailable, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return;
      }
      if (results?.length > 0) {
        const matched = bcrypt.compareSync(password, results[0].password);
        if (matched) {
          const token = createToken(results[0]);
          return res
            .status(200)
            .json({ success: { msg: "Login Successfully" }, token: token });
        } else {
          return res.status(401).json({ error: { msg: "Incorrect Password" } });
        }
      } else {
        return res.status(404).json({ error: { msg: "Email Not Found." } });
      }
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.setNewPassword = async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;

    const checkUserAvailable = `SELECT * FROM admin_users WHERE id = ${id}`;
    connection.query(checkUserAvailable, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return;
      }
      if (results?.length === 0) {
        return res.status(400).json({ error: { msg: "Invalid link" } });
      } else {
        const checkUserToken = `SELECT * FROM admin_user_token WHERE token = \"${token}\"`;
        connection.query(checkUserToken, function (err, resultToken) {
          if (err) throw err;
          if (resultToken?.length === 0) {
            return res.status(400).json({ error: { msg: "Invalid link" } });
          } else {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            const updateUser = `UPDATE admin_users SET password = \"${hash}\" WHERE id = ${id}`;
            connection.query(updateUser, function (err, resultUpdate) {
              if (err) throw err;
              const deleteToken = `DELETE FROM admin_user_token WHERE user_id = ${id}`;
              connection.query(deleteToken, function (err, resultDelete) {
                if (err) throw err;
                return res.status(200).json({
                  success: { msg: "New Password added Successfully" },
                });
              });
            });
          }
        });
      }
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};
