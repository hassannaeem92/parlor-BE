const connection = require("../config/db");

module.exports.getCharges = async (req, res) => {
  try {
    const chargeQuery = `SELECT * FROM charges`;
    connection.query(chargeQuery, function (err, result) {
      if (err) throw err;
      return res.status(200).json(result[0]);
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};
