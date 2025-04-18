const connection = require("../../config/db");
module.exports.addPolicies = async (req, res) => {
  const { title, description, status, createdBy } = req.body;

  try {
    const insertPolicies = `INSERT INTO refund_policies (title, description, status, issued_by) VALUES (?, ?, ?, ?)`;
    const values = [title, description, status, createdBy];
    connection.query(insertPolicies, values, function (err, result) {
      if (err) throw err;

      return res
        .status(200)
        .json({ success: { msg: "Policies added Successfully!" } });
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.getPolicies = async (req, res) => {
  try {
    const getPolicies = `SELECT * FROM refund_policies where is_delete = ${false} ORDER BY created_at DESC`;
    connection.query(getPolicies, function (err, result) {
      if (err) throw err;

      return res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.deletePolicies = async (req, res) => {
  const { id } = req.params;
  try {
    const delPolicies = `UPDATE refund_policies SET is_delete = ? where id = ?`;
    const values = [true, id];
    connection.query(delPolicies, values, function (err, result) {
      if (err) throw err;

      return res
        .status(200)
        .json({ success: { msg: "Policies deleted Successfully!" } });
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.getSpecificPolicies = async (req, res) => {
  const { id } = req.params;
  try {
    const getPolicies = `SELECT * FROM refund_policies where id = ${id}`;

    connection.query(getPolicies, function (err, result) {
      if (err) throw err;

      return res.status(200).json(result[0]);
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.updatePolicies = async (req, res) => {
  const { title, status, description } = req.body;
  const { id } = req.params;
  try {
    const insertPolicies = `UPDATE refund_policies SET title = ?,description=?,status=?  where id = ?`;
    const values = [title, description, status, id];
    connection.query(insertPolicies, values, function (err, result) {
      if (err) throw err;

      return res
        .status(200)
        .json({ success: { msg: "Policies updated Successfully!" } });
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.delMultiplePolicies = async (req, res) => {
  const policiesIds = req.body;
  const idString = policiesIds.join(",");

  try {
    const insertPolicies = `UPDATE refund_policies SET is_delete = 1 where id IN (${idString})`;

    connection.query(insertPolicies, function (err, result) {
      if (err) throw err;

      return res.status(200).json({
        success: { msg: "Selected refund_policies deleted Successfully!" },
      });
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};
