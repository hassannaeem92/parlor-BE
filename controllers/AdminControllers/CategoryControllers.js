const connection = require("../../config/db");
const env = require("../../global");
const fs = require('fs');
const path = require('path');

function query(sql) {
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
}


module.exports.addCategory = async (req, res) => {
  const { category,description,description2 } = req.body;
  
  let filePath = '';
  if(req.files) {
    req.files.map((file) => {
      filePath = `/${file.filename}`
    })
 }
 console.log("file is: ", filePath)
  try {
    const checkUserAvailable = `SELECT * FROM categories WHERE name = \"${category}\" AND is_delete = 0`;
    connection.query(checkUserAvailable, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return;
      }
      if (results?.length > 0) {
        return res
          .status(400)
          .json({ error: { msg: "Service already exist!" } });
      } else {
        const insertCategory = `INSERT INTO categories (name,description,description2,imagePath) VALUES (\"${category}\",\"${description}\",\"${description2}\",\"${filePath}\")`;
        connection.query(insertCategory, function (err, result) {
          if (err) throw err;

          return res
            .status(200)
            .json({ success: { msg: "Service added Successfully!" } });
        });
      }
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.getCategory = async (req, res) => {
  try {
    const getCategory = `SELECT * FROM categories where is_delete = ${false} ORDER BY created_at DESC`;
    connection.query(getCategory, function (err, result) {
      if (err) throw err;

      return res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const getSubCategory = `Select * from sub_categories where is_delete=${false} and category_id=${id}`;
    connection.query(getSubCategory, function (err, result) {
      if (err) throw err;

      if (result?.length > 0) {
        return res
          .status(400)
          .json({ error: { msg: "Subcategories should be deleted first!" } });
      } else {
        const delCategory = `UPDATE categories SET is_delete = ${true} where id = ${id}`;
        connection.query(delCategory, function (err, result) {
          if (err) throw err;

          return res
            .status(200)
            .json({ success: { msg: "Category deleted Successfully!" } });
        });
      }
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.getSpecificCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const getCategory = `SELECT * FROM categories where id = ${id}`;

    connection.query(getCategory, function (err, result) {
      if (err) throw err;

      return res.status(200).json(result[0]);
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.updateCategory = async (req, res) => {

  const { category,description, description2 } = req.body;
  const { id } = req.params;
  filePath = ''
  try {
    const checkCategories  = `Select count(*) as count, imagePath from categories where id = ${id}`
    const getCategories = await query(checkCategories);
    if(getCategories[0].count > 0) {
      console.log(getCategories[0]?.imagePath)
    if(req.files.length > 0) {
      const output = getCategories[0]?.imagePath ? await deleteFile(getCategories[0].imagePath) : '';
      req.files.map((file) => {
        filePath = `/${file.filename}`
      })
       insertServicePriceQuery  = `
          UPDATE categories SET 
          name = \"${category}\", 
          description=\"${description}\",
          description2=\"${description2}\",
          imagePath = \"${filePath}\"
          where id = ${id}
    `;
   }else{
    insertServicePriceQuery  = `
    UPDATE categories SET 
    name = \"${category}\", 
    description=\"${description}\" 
    description=\"${description2}\" 
    where id = ${id}
`;
   }
  } 
    connection.query(insertServicePriceQuery, function (err, result) {
      if (err) throw err;

      return res
        .status(200)
        .json({ success: { msg: "Category updated Successfully!" } });
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.delMultipleCategory = async (req, res) => {
  const categoryIds = req.body;
  const idString = categoryIds.join(",");

  try {
    const getSubCategory = `Select * from sub_categories where is_delete=${false} and category_id IN (${idString})`;
    connection.query(getSubCategory, function (err, result) {
      if (err) throw err;

      if (result?.length > 0) {
        return res
          .status(400)
          .json({ error: { msg: "Subcategories should be deleted first!" } });
      } else {
        const getProductsQuery = `Select p.category_id from products as p JOIN categories as c ON c.id=p.category_id where p.is_deleted=0 and c.is_delete=0 and c.id IN (${idString})`;
        connection.query(getProductsQuery, function (err, result) {
          if (err) throw err;

          if (result?.length > 0) {
            return res.status(400).json({
              error: {
                msg: "The products in this category should be deleted first!",
              },
            });
          } else {
            const insertCategory = `UPDATE categories SET is_delete = ${true} where id IN (${idString})`;
            connection.query(insertCategory, function (err, result) {
              if (err) throw err;

              return res.status(200).json({
                success: { msg: "Selected categories deleted Successfully!" },
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

module.exports.addSubCategory = async (req, res) => {
  const { subCategory, categoryId } = req.body;

  try {
    const checkSubCategory = `SELECT * FROM sub_categories WHERE name = \"${subCategory}\" AND category_id=${categoryId} AND is_delete = 0`;
    connection.query(checkSubCategory, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return;
      }
      if (results?.length > 0) {
        return res
          .status(400)
          .json({ error: { msg: "Sub Category already exist!" } });
      } else {
        const insertCategory = `INSERT INTO sub_categories ( name, category_id) VALUES (\"${subCategory}\", ${categoryId})`;
        connection.query(insertCategory, function (err, result) {
          if (err) throw err;

          return res
            .status(200)
            .json({ success: { msg: "Sub Category added Successfully!" } });
        });
      }
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.getSubCategory = async (req, res) => {
  try {
    const getSubCategoryQuery = `
    SELECT sc.id AS id, sc.name AS name, sc.created_at AS created_at,
           c.name AS category_name, c.id AS category_id
    FROM sub_categories AS sc
    INNER JOIN categories AS c ON c.id = sc.category_id
    WHERE sc.is_delete = ? ORDER BY sc.created_at DESC;
  `;

    connection.query(getSubCategoryQuery, [false], function (err, result) {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: { msg: "Internal Server Error" } });
      }

      return res.status(200).json(result);
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: { msg: "Uncatchable Error Occurred" } });
  }
};

module.exports.getSpecificSubCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const getCategory = `SELECT * FROM sub_categories where id = ${id}`;
    connection.query(getCategory, function (err, result) {
      if (err) throw err;

      return res.status(200).json(result[0]);
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.updateSubCategory = async (req, res) => {
  const { subCategory, categoryId } = req.body;
  const { id } = req.params;
  try {
    const insertCategory = `UPDATE sub_categories SET name = \"${subCategory}\", category_id = ${categoryId} where id = ${id}`;
    connection.query(insertCategory, function (err, result) {
      if (err) throw err;

      return res
        .status(200)
        .json({ success: { msg: "Sub Category updated Successfully!" } });
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.delMultipleSubCategory = async (req, res) => {
  const subCategoryIds = req.body;

  const idString = subCategoryIds.join(",");

  try {
    const getProductsQuery = `Select p.sub_category_id from products as p JOIN sub_categories as s ON s.id=p.sub_category_id where p.is_deleted=0 and s.is_delete=0 and s.id IN (${idString})`;
    connection.query(getProductsQuery, function (err, result) {
      if (err) throw err;

      if (result?.length > 0) {
        return res.status(400).json({
          error: {
            msg: "The products in this sub category should be deleted first!",
          },
        });
      } else {
        const insertCategory = `UPDATE sub_categories SET is_delete = ${true} where id IN (${idString})`;
        connection.query(insertCategory, function (err, result) {
          if (err) throw err;

          return res.status(200).json({
            success: { msg: "Selected sub categories deleted Successfully!" },
          });
        });
      }
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

const deleteFile = (filename) => {
  const filePath = path.join(__dirname,'./../../', 'public', 'uploads', filename);
  console.log("filepath is: ", filePath)
  // Use fs.unlink() to delete the file
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Error deleting the file:', err);
      return 0;
    }else{
      console.log("this is in else ")
      return 1;
    }

    // console.log('File deleted successfully');
  });
};