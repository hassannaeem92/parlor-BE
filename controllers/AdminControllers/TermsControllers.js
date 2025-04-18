const connection = require("../../config/db");
module.exports.addTerms = async (req, res) => {
  const { title, description, status, createdBy } = req.body;

  try {
    const insertTerms = `INSERT INTO terms_condition (title, description, status, issued_by) VALUES (?, ?, ?, ?)`;
    const values = [title, description, status, createdBy];
    connection.query(insertTerms, values, function (err, result) {
      if (err) throw err;

      return res
        .status(200)
        .json({ success: { msg: "Terms added Successfully!" } });
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.getTerms = async (req, res) => {
  try {
    const getTerms = `SELECT * FROM terms_condition where is_delete = ${false} ORDER BY created_at DESC`;
    connection.query(getTerms, function (err, result) {
      if (err) throw err;

      return res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.deleteTerms = async (req, res) => {
  const { id } = req.params;
  try {
    const delTerms = `UPDATE terms_condition SET is_delete = ? where id = ?`;
    const values = [true, id];
    connection.query(delTerms, values, function (err, result) {
      if (err) throw err;

      return res
        .status(200)
        .json({ success: { msg: "Terms deleted Successfully!" } });
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.getSpecificTerms = async (req, res) => {
  const { id } = req.params;
  try {
    const getTerms = `SELECT * FROM terms_condition where id = ${id}`;

    connection.query(getTerms, function (err, result) {
      if (err) throw err;

      return res.status(200).json(result[0]);
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.updateTerms = async (req, res) => {
  const { title, status, description } = req.body;
  const { id } = req.params;
  try {
    const insertTerms = `UPDATE terms_condition SET title = ?,description=?,status=?  where id = ?`;
    const values = [title, description, status, id];
    connection.query(insertTerms, values, function (err, result) {
      if (err) throw err;

      return res
        .status(200)
        .json({ success: { msg: "Terms updated Successfully!" } });
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.delMultipleTerms = async (req, res) => {
  const termsIds = req.body;
  const idString = termsIds.join(",");

  try {
    const insertTerms = `UPDATE terms_condition SET is_delete =  1 where id IN (${idString})`;

    connection.query(insertTerms, function (err, result) {
      if (err) throw err;

      return res.status(200).json({
        success: { msg: "Selected terms_condition deleted Successfully!" },
      });
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};
