const connection = require("../config/db");

module.exports.getFAQs = async (req, res) => {
  try {
    const getFAQs = `SELECT id,faq_title as title,faq_description as content FROM faqs where is_delete = ${false}`;
    connection.query(getFAQs, function (err, result) {
      if (err) throw err;

      return res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.getTerms = async (req, res) => {
  try {
    const getTerms = `SELECT id,title,description as content FROM terms_condition where is_delete = ${false} `;
    connection.query(getTerms, function (err, result) {
      if (err) throw err;
      return res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};
module.exports.getPolicies = async (req, res) => {
  try {
    const getPolicies = `SELECT id,title,description as content FROM refund_policies where is_delete = ${false} `;
    connection.query(getPolicies, function (err, result) {
      if (err) throw err;

      return res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};
