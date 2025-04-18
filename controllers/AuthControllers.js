const connection = require("../config/db");
const bcrypt = require("bcryptjs");
const env = require("../global");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const createToken = (user) => {
  return jwt.sign({ user }, env.SECRET, {
    expiresIn: "1d",
  });
};

module.exports.register = async (req, res) => {
  const { name, last_name, email, password } = req.body;

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

        const token = crypto.randomBytes(32).toString("hex");

        const inserUser = `INSERT INTO users ( name, last_name, email, password) VALUES (\"${name}\", \"${last_name}\", \"${email}\", \"${hash}\")`;
        connection.query(inserUser, function (err, resultUser) {
          if (err) throw err;
          const insertToken = `INSERT INTO verify_token ( user_id, token) VALUES (${resultUser.insertId}, \"${token}\")`;
          connection.query(insertToken, async function (err, resultToken) {
            if (err) throw err;
            const url = `${env.BASE_URL}users/${resultUser.insertId}/verify/${token}`;
            await sendEmail(email, "Verify Email", url);

            return res.status(200).json({
              success: { msg: "Verification Email Send Successfully!" },
            });
          });
        });
      }
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.verifyToken = async (req, res) => {
  try {
    const { id, token } = req.params;

    const checkUserAvailable = `SELECT * FROM users WHERE id = ${id}`;
    connection.query(checkUserAvailable, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return;
      }
      if (results?.length === 0) {
        return res.status(400).json({ error: { msg: "Invalid link" } });
      } else {
        const checkUserToken = `SELECT * FROM verify_token WHERE token = \"${token}\"`;
        connection.query(checkUserToken, function (err, resultToken) {
          if (err) throw err;
          if (resultToken?.length === 0) {
            return res.status(400).json({ error: { msg: "Invalid link" } });
          } else {
            const updateUser = `UPDATE users SET is_verified = ${true} WHERE id = ${id}`;
            connection.query(updateUser, function (err, resultUpdate) {
              if (err) throw err;
              const deleteToken = `DELETE FROM verify_token WHERE user_id = ${id}`;
              connection.query(deleteToken, function (err, resultDelete) {
                if (err) throw err;
                res
                  .status(200)
                  .send({ success: { msg: "Email verified successfully" } });
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

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUserAvailable = `SELECT * FROM users WHERE email = \"${email}\"`;

    connection.query(checkUserAvailable, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return;
      }
      if (results?.length > 0) {
        const matched = bcrypt.compareSync(password, results[0].password);
        if (matched) {
          if (!results[0].is_verified) {
            const token = crypto.randomBytes(32).toString("hex");
            const insertToken = `INSERT INTO verify_token ( user_id, token) VALUES (${results[0].id}, \"${token}\")`;
            connection.query(insertToken, async function (err, resultToken) {
              if (err) throw err;
              const url = `${env.BASE_URL}users/${results[0].id}/verify/${token}`;
              await sendEmail(email, "Verify Email", url);

              return res.status(401).json({
                error: { msg: "Email Verification Send Successfully!" },
              });
            });
          } else {
            const token = createToken(results[0]);
            return res
              .status(200)
              .json({ success: { msg: "Login Successfully" }, token: token });
          }
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

module.exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  try {
    const checkUserAvailable = `SELECT * FROM users WHERE email = \"${email}\"`;
    connection.query(checkUserAvailable, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return;
      }
      if (results?.length > 0) {
        const token = crypto.randomBytes(32).toString("hex");
        const insertToken = `INSERT INTO verify_token ( user_id, token) VALUES (${results[0].id}, \"${token}\")`;
        connection.query(insertToken, async function (err, resultToken) {
          if (err) throw err;
          const url = `${env.BASE_URL}users/${results[0].id}/forgot-password/${token}`;
          await sendEmail(email, "Forgot Password", url);
          return res.status(200).json({
            success: { msg: "Verification Email Send Successfully!" },
          });
        });
      } else {
        return res.status(404).json({ error: { msg: "Email Not Found." } });
      }
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.resetPassword = async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;

    const checkUserAvailable = `SELECT * FROM users WHERE id = ${id}`;
    connection.query(checkUserAvailable, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return;
      }
      if (results?.length === 0) {
        return res.status(400).json({ error: { msg: "Invalid link" } });
      } else {
        const checkUserToken = `SELECT * FROM verify_token WHERE token = \"${token}\"`;
        connection.query(checkUserToken, function (err, resultToken) {
          if (err) throw err;
          if (resultToken?.length === 0) {
            return res.status(400).json({ error: { msg: "Invalid link" } });
          } else {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            const updateUser = `UPDATE users SET password = \"${hash}\", is_verified = ${true} WHERE id = ${id}`;
            connection.query(updateUser, function (err, resultUpdate) {
              if (err) throw err;
              const deleteToken = `DELETE FROM verify_token WHERE user_id = ${id}`;
              connection.query(deleteToken, function (err, resultDelete) {
                if (err) throw err;
                return res
                  .status(200)
                  .json({ success: { msg: "Password Reset Successfully" } });
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
