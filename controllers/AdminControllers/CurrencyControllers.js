const connection = require("../../config/db");

module.exports.addCurrency = async (req, res) => {
  const { name, unit, description, status } = req.body;

  try {
    const checkUserAvailable = `SELECT * FROM currency WHERE is_active = ${true}`;
    connection.query(checkUserAvailable, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return;
      }
      if (results?.length > 0) {
        if (status) {
          const insertCategory = `UPDATE currency SET is_active = ${false}`;
          connection.query(insertCategory, function (err, result) {
            if (err) throw err;
            const inserUser = `INSERT INTO currency ( name, unit, description, is_active) VALUES (\"${name}\", \"${unit}\", \"${description}\", ${status})`;
            connection.query(inserUser, function (err, resultUser) {
              return res.status(200).json({
                success: {
                  msg: "Currency Added Successfully!",
                },
              });
            });
          });
        } else {
          const inserUser = `INSERT INTO currency ( name, unit, description, is_active) VALUES (\"${name}\", \"${unit}\", \"${description}\", ${status})`;
          connection.query(inserUser, function (err, resultUser) {
            return res.status(200).json({
              success: {
                msg: "Currency Added Successfully!",
              },
            });
          });
        }
      } else {
        const inserUser = `INSERT INTO currency ( name, unit, description, is_active) VALUES (\"${name}\", \"${unit}\", \"${description}\", ${status})`;
        connection.query(inserUser, function (err, resultUser) {
          return res.status(200).json({
            success: {
              msg: "Currency Added Successfully And Set As By Default!",
            },
          });
        });
      }
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.getCurrency = async (req, res) => {
  try {
    const getCategory = `SELECT * FROM currency where is_delete = ${false} ORDER BY created_at DESC`;
    connection.query(getCategory, function (err, result) {
      if (err) throw err;

      return res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.delMultipleCurrency = async (req, res) => {
  const currencyIds = req.body;
  const idString = currencyIds.join(",");

  try {
    const insertCategory = `UPDATE currency SET is_delete = ${true} where id IN (${idString})`;
    connection.query(insertCategory, function (err, result) {
      if (err) throw err;

      return res.status(200).json({
        success: { msg: "Selected currencies deleted Successfully!" },
      });
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.getSpecificCurrency = async (req, res) => {
  const { id } = req.params;
  try {
    const getCategory = `SELECT * FROM currency where id = ${id}`;
    connection.query(getCategory, function (err, result) {
      if (err) throw err;

      return res.status(200).json(result[0]);
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.updateCurrency = async (req, res) => {
  const { name, unit, description, status } = req.body;
  const { id } = req.params;
  try {
    const checkUserAvailable = `SELECT * FROM currency WHERE is_active = ${true}`;
    connection.query(checkUserAvailable, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return;
      }
      if (results?.length > 0) {
        if (status) {
          const insertCategory = `UPDATE currency SET is_active = ${false}`;
          connection.query(insertCategory, function (err, result) {
            if (err) throw err;
            const insertCategory = `UPDATE currency SET name = \"${name}\", unit = \"${unit}\", description = \"${description}\", is_active = ${status} where id = ${id}`;
            connection.query(insertCategory, function (err, result) {
              if (err) throw err;

              return res
                .status(200)
                .json({ success: { msg: "Currency updated Successfully!" } });
            });
          });
        } else {
          const insertCategory = `UPDATE currency SET name = \"${name}\", unit = \"${unit}\", description = \"${description}\", is_active = ${status} where id = ${id}`;
          connection.query(insertCategory, function (err, result) {
            if (err) throw err;

            return res
              .status(200)
              .json({ success: { msg: "Currency updated Successfully!" } });
          });
        }
      } else {
        const insertCategory = `UPDATE currency SET name = \"${name}\", unit = \"${unit}\", description = \"${description}\", is_active = ${status} where id = ${id}`;
        connection.query(insertCategory, function (err, result) {
          if (err) throw err;

          return res
            .status(200)
            .json({ success: { msg: "Currency updated Successfully!" } });
        });
      }
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.getEnableCurrency = async (req, res) => {
  try {
    const getCategory = `SELECT * FROM currency where is_active = ${true}`;
    connection.query(getCategory, function (err, result) {
      if (err) throw err;

      return res.status(200).json(result[0]);
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};
