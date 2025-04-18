const connection = require("../../config/db");
module.exports.addFAQs = async (req, res) => {
  const { title, description, status, createdBy } = req.body;

  try {
    const insertFAQ = `INSERT INTO faqs ( faq_title,faq_description,status,issued_by) VALUES (?,?,?,?)`;
    const values = [title, description, status, createdBy];

    connection.query(insertFAQ, values, function (err, result) {
      if (err) throw err;

      return res
        .status(200)
        .json({ success: { msg: "FAQs added Successfully!" } });
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.getFAQs = async (req, res) => {
  try {
    const getFAQs = `SELECT * FROM faqs where is_delete = ${false} ORDER BY created_at DESC`;
    connection.query(getFAQs, function (err, result) {
      if (err) throw err;

      return res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.deleteFAQs = async (req, res) => {
  const { id } = req.params;

  try {
    const delFAQs = `UPDATE faqs SET is_delete = ${true} where id = ${id}`;

    const values = [true, id];
    connection.query(delFAQs, values, function (err, result) {
      if (err) throw err;

      return res
        .status(200)
        .json({ success: { msg: "Faq deleted Successfully!" } });
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.getSpecificFAQs = async (req, res) => {
  const { id } = req.params;
  try {
    const getFAQs = `SELECT * FROM faqs where id = ${id}`;

    connection.query(getFAQs, function (err, result) {
      if (err) throw err;

      return res.status(200).json(result[0]);
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.updateFAQs = async (req, res) => {
  const { title, status, description } = req.body;
  const { id } = req.params;
  try {
    const insertFAQs = `UPDATE faqs SET faq_title = ?,faq_description=?,status=?  where id =?`;
    const values = [title, description, status, id];
    connection.query(insertFAQs, values, function (err, result) {
      if (err) throw err;

      return res
        .status(200)
        .json({ success: { msg: "FAQ updated Successfully!" } });
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.delMultipleFAQs = async (req, res) => {
  const faqsIds = req.body;
  const idString = faqsIds.join(",");
  console.log(idString);

  try {
    const insertFAQ = `UPDATE faqs SET is_delete = 1 where id IN (${idString})`;

    connection.query(insertFAQ, function (err, result) {
      if (err) throw err;

      return res.status(200).json({
        success: { msg: "Selected faqs deleted Successfully!" },
      });
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};
