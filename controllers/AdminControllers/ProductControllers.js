const connection = require("../../config/db");
const env = require("../../global");
const getOptions = () => {
  return new Promise((resolve, reject) => {
    const getOptionQuery = "SELECT label FROM varient_options";

    connection.query(getOptionQuery, (err, resultOption) => {
      if (err) {
        reject(err);
      } else {
        const optionArr = resultOption.map((option) => option.label);
        resolve(optionArr);
      }
    });
  });
};

function queryPromise(query, values = []) {
  return new Promise((resolve, reject) => {
    connection.query(query, values, function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

module.exports.addProduct = async (req, res) => {
  try {
    const {
      title,
      articleName,
      description,
      status,
      price,
      purchasePrice,
      discount,
      samePurchasePrice,
      subCategoryId,
      categoryId,
      userId,
      samePrice,
      sameDiscount,
      varients,
    } = req.body;

    const images = req.files;

    // Check if articleName is already available
    const articleNameExistsQuery = `SELECT COUNT(*) as count FROM products WHERE article_name = "${articleName}"`;
    const articleNameExistsResult = await queryPromise(articleNameExistsQuery);

    if (articleNameExistsResult[0].count > 0) {
      return res
        .status(400)
        .json({ error: { msg: "Article number already available" } });
    }

    // Fetch available options from the database
    const optionArr = await getOptions();

    // Process variants and create values array
    const valueArr = varients.map((varient) => {
      const values = optionArr.map((option) => varient[option]);
      return JSON.stringify(values);
    });

    // Insert the main product information into the 'products' table
    const insertProductQuery = `INSERT INTO products (title, article_name, purchase_price, is_same_purchase_price, price, is_same_price, discount, is_same_discount, description, category_id, sub_category_id, is_active, created_by, updated_by) VALUES ("${title}", "${articleName}", ${purchasePrice}, ${samePurchasePrice}, ${price}, ${samePrice},  ${discount}, ${sameDiscount}, "${description}", ${categoryId}, ${subCategoryId}, ${status}, ${userId}, ${userId})`;

    connection.query(insertProductQuery, function (err, productResult) {
      if (err) throw err;

      // Insert variants into the 'variants' table
      varients.forEach(async (varient, index) => {
        const insertVariantQuery = `INSERT INTO varients ( product_id, virtual_id, options, varient_values, purchase_price, price, discount, quantity ) VALUES ( ${productResult.insertId},  ${varient.id}, ?, ?, ${varient.purchasePrice}, ${varient.price}, ${varient.discount}, ${varient.quantity} )`;
        connection.query(
          insertVariantQuery,
          [JSON.stringify(optionArr), valueArr[index]],
          function (err, variantResult) {
            if (err) throw err;
          }
        );
      });

      // Insert variants into the 'variants' table
      images.forEach(async (image, index) => {
        const insertProImg = `INSERT INTO product_images ( product_id, image ) VALUES ( ${productResult.insertId},  \"${image.filename}\")`;
        connection.query(insertProImg, function (err, imageResult) {
          if (err) throw err;
        });
      });

      return res
        .status(200)
        .json({ success: { msg: "Product added Successfully!" } });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.getProducts = async (req, res) => {
  try {
    const getProductsQuery = `
      SELECT 
        p.id,
        p.title,
        p.article_name,
        p.price,
        p.purchase_price,
        p.discount,
        p.description,
        p.category_id,
        p.sub_category_id,
        p.is_same_price,
        p.is_same_purchase_price,
        p.is_same_discount,
        p.is_active,
        p.is_deleted,
        p.created_by,
        p.updated_by,
        p.created_at,
        p.updated_at,
        c.id AS category_id,
        c.name AS category_name,
        c.is_delete as c_delete,
        sc.id AS sub_category_id,
        sc.name AS sub_category_name,
        sc.is_delete AS sc_delete,
        uc.first_name AS created_by_username,
        uu.first_name AS updated_by_username
      FROM 
        products p
      JOIN 
        categories c ON p.category_id = c.id 
      JOIN 
        sub_categories sc ON p.sub_category_id = sc.id
      JOIN 
      admin_users uc ON p.created_by = uc.id
      JOIN 
      admin_users uu ON p.updated_by = uu.id
      WHERE 
        p.is_deleted = ${false}  ORDER BY p.created_at DESC;
    `;

    connection.query(getProductsQuery, async (err, products) => {
      if (err) throw err;

      for (let i = 0; i < products?.length; i++) {
        const productId = products[i].id;
        const getVariantsQuery = `
          SELECT
            virtual_id AS id,
            product_id,
            options,
            varient_values,
            price,
            quantity,
            discount,
            purchase_price AS purchasePrice
          FROM 
            varients
          WHERE 
            product_id = ${productId};
        `;

        // Execute the query to get variants for the current product
        const varients = await new Promise((resolve, reject) => {
          connection.query(getVariantsQuery, (err, result) => {
            if (err) reject(err);

            // Process options and varient_values
            const processedVariants = result.map((variant) => {
              const options = JSON.parse(variant.options);
              const varientValues = JSON.parse(variant.varient_values);

              // Create an object with keys from options and values from varient_values
              const variantObj = { ...variant };
              for (let j = 0; j < options?.length; j++) {
                variantObj[options[j]] = varientValues[j];
              }

              return variantObj;
            });

            resolve(processedVariants);
          });
        });

        // Add the processed variants to the current product
        products[i].varients = varients;

        const getImagesQuery = `
        SELECT
          *
        FROM 
        product_images
        WHERE 
          product_id = ${productId} AND is_delete = ${false};
      `;

        // Execute the query to get variants for the current product
        const images = await new Promise((resolve, reject) => {
          connection.query(getImagesQuery, (err, result) => {
            if (err) reject(err);

            resolve(result);
          });
        });

        // Add the processed variants to the current product
        products[i].all_images = images;
        products[i].image_path = env.ADMIN_BACKEND_URL + "product_images/";
      }

      return res.status(200).json(products);
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: { msg: "Uncatchable Error Occurred" } });
  }
};

module.exports.delMultipleProducts = async (req, res) => {
  const productIds = req.body;

  const idString = productIds.join(",");

  try {
    // Check if any of the products have associated purchase products
    const getPurchaseQuery = `SELECT product_id FROM purchase_products WHERE product_id IN (${idString})`;
    const purchaseResult = await queryPromise(getPurchaseQuery);

    if (purchaseResult.length > 0) {
      return res.status(400).json({
        error: { msg: "Cannot delete products with associated purchases" },
      });
    }

    // Soft delete the products by setting is_deleted to true and nullifying article_name
    const deleteProductsQuery = `UPDATE products SET is_deleted = true, article_name = NULL WHERE id IN (${idString})`;
    connection.query(deleteProductsQuery, function (err, result) {
      if (err) throw err;

      return res.status(200).json({
        success: { msg: "Selected products deleted successfully!" },
      });
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: { msg: "Uncatchable Error Occurred" } });
  }
};

module.exports.getSpecificProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const getProductsQuery = `
      SELECT 
        p.id,
        p.title,
        p.article_name,
        p.price,
        p.purchase_price,
        p.discount,
        p.description,
        p.category_id,
        p.sub_category_id,
        p.is_same_price,
        p.is_same_purchase_price,
        p.is_same_discount,
        p.is_active,
        p.is_deleted,
        p.created_by,
        p.updated_by,
        p.created_at,
        p.updated_at,
        c.id AS category_id,
        c.name AS category_name,
        c.is_delete as c_delete,
        sc.id AS sub_category_id,
        sc.name AS sub_category_name,
        sc.is_delete as sc_delete,
        uc.first_name AS created_by_username,
        uu.first_name AS updated_by_username
      FROM 
        products p
      JOIN 
        categories c ON p.category_id = c.id
      JOIN 
        sub_categories sc ON p.sub_category_id = sc.id
      JOIN 
      admin_users uc ON p.created_by = uc.id
      JOIN 
      admin_users uu ON p.updated_by = uu.id
      WHERE 
       p.id = ${id}
    `;

    connection.query(getProductsQuery, async (err, products) => {
      if (err) throw err;

      for (let i = 0; i < products?.length; i++) {
        const productId = products[i].id;
        const getVariantsQuery = `
          SELECT
            id AS varient_id,
            virtual_id AS id,
            product_id,
            options,
            varient_values,
            price,
            quantity,
            discount,
            purchase_price AS purchasePrice
          FROM 
            varients
          WHERE 
            product_id = ${productId};
        `;

        // Execute the query to get variants for the current product
        const varients = await new Promise((resolve, reject) => {
          connection.query(getVariantsQuery, (err, result) => {
            if (err) reject(err);

            // Process options and varient_values
            const processedVariants = result.map((variant) => {
              const options = JSON.parse(variant.options);
              const varientValues = JSON.parse(variant.varient_values);

              // Create an object with keys from options and values from varient_values
              const variantObj = { ...variant };
              for (let j = 0; j < options?.length; j++) {
                variantObj[options[j]] = varientValues[j];
              }

              return variantObj;
            });

            resolve(processedVariants);
          });
        });

        // Add the processed variants to the current product
        products[i].varients = varients;

        const getImagesQuery = `
        SELECT
          *
        FROM 
        product_images
        WHERE 
          product_id = ${productId} AND is_delete = ${false};
      `;

        // Execute the query to get variants for the current product
        const images = await new Promise((resolve, reject) => {
          connection.query(getImagesQuery, (err, result) => {
            if (err) reject(err);

            resolve(result);
          });
        });

        // Add the processed variants to the current product
        products[i].all_images = images;
        products[i].image_path = env.ADMIN_BACKEND_URL + "product_images/";
      }

      return res.status(200).json(products[0]);
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: { msg: "Uncatchable Error Occurred" } });
  }
};

module.exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params; // Assuming the id is in the URL params
    const {
      title,
      articleName,
      description,
      status,
      price,
      discount,
      purchasePrice,
      samePurchasePrice,
      sameDiscount,
      subCategoryId,
      categoryId,
      userId,
      samePrice,
      varients,
    } = req.body;

    const images = req.files;

    // Check if articleName is already available
    const articleNameExistsQuery = `SELECT COUNT(*) as count FROM products WHERE article_name = "${articleName}" AND id != ${id}`;
    const articleNameExistsResult = await queryPromise(articleNameExistsQuery);

    if (articleNameExistsResult[0].count > 0) {
      return res
        .status(400)
        .json({ error: { msg: "Article number already available" } });
    }

    // Fetch available options from the database
    const optionArr = await getOptions();

    // Process variants and create values array
    const valueArr = varients.map((varient) => {
      const values = optionArr.map((option) => varient[option]);
      return JSON.stringify(values);
    });

    // Update the main product information in the 'products' table
    const updateProductQuery = `UPDATE products SET title="${title}", article_name="${articleName}", purchase_price=${purchasePrice}, is_same_purchase_price=${samePurchasePrice}, price=${price}, is_same_price=${samePrice}, discount=${discount}, is_same_discount=${sameDiscount}, description="${description}", category_id=${categoryId}, sub_category_id=${subCategoryId}, is_active=${status}, updated_by=${userId} WHERE id=${id}`;

    connection.query(updateProductQuery, function (err, productResult) {
      if (err) throw err;

      // Delete previous variants for the given product ID
      const deleteVariantsQuery = `DELETE FROM varients WHERE product_id=${id}`;
      connection.query(deleteVariantsQuery, function (err, deleteResult) {
        if (err) throw err;

        // Insert new variants into the 'variants' table
        varients.forEach(async (varient, index) => {
          const insertVariantQuery = `INSERT INTO varients (id, product_id, virtual_id, options, varient_values, purchase_price, price, discount, quantity ) VALUES ( ${
            varient?.varient_id ? varient?.varient_id : null
          }, ${id},  ${varient.id}, ?, ?, ${varient.purchasePrice}, ${
            varient.price
          }, ${varient.discount}, ${varient.quantity} )`;
          connection.query(
            insertVariantQuery,
            [JSON.stringify(optionArr), valueArr[index]],
            function (err, variantResult) {
              if (err) throw err;
            }
          );
        });

        // Insert variants into the 'variants' table
        images.forEach(async (image, index) => {
          const insertProImg = `INSERT INTO product_images ( product_id, image ) VALUES ( ${id},  \"${image.filename}\")`;
          connection.query(insertProImg, function (err, imageResult) {
            if (err) throw err;
          });
        });

        return res
          .status(200)
          .json({ success: { msg: "Product updated Successfully!" } });
      });
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: { msg: "Uncatchable Error Occurred" } });
  }
};

module.exports.getVarientOptions = async (req, res) => {
  try {
    const getCategory = `SELECT * FROM varient_options`;
    connection.query(getCategory, function (err, result) {
      if (err) throw err;

      return res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.getOptionValues = async (req, res) => {
  try {
    const getCategory = `SELECT * FROM option_values`;
    connection.query(getCategory, function (err, result) {
      if (err) throw err;

      return res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.getSpecificVarientByProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const getVariantsQuery = `
          SELECT
            id AS varient_id,
            virtual_id AS id,
            product_id,
            options,
            varient_values,
            price,
            quantity,
            purchase_price AS purchasePrice
          FROM 
            varients
          WHERE 
            product_id = ${id};
        `;

    // Execute the query to get variants for the current product
    const varients = await new Promise((resolve, reject) => {
      connection.query(getVariantsQuery, (err, result) => {
        if (err) reject(err);

        // Process options and varient_values
        const processedVariants = result.map((variant) => {
          const options = JSON.parse(variant.options);
          const varientValues = JSON.parse(variant.varient_values);

          // Create an object with keys from options and values from varient_values
          const variantObj = { ...variant };
          for (let j = 0; j < options?.length; j++) {
            variantObj[options[j]] = varientValues[j];
          }

          return variantObj;
        });

        resolve(processedVariants);
      });
    });

    return res.status(200).json(varients);
  } catch (error) {
    return res
      .status(500)
      .json({ error: { msg: "Uncatchable Error Occurred" } });
  }
};

module.exports.getAllVarients = async (req, res) => {
  try {
    const getVariantsQuery = `
          SELECT
            id AS varient_id,
            virtual_id AS id,
            product_id,
            options,
            varient_values,
            price,
            quantity,
            purchase_price AS purchasePrice
          FROM 
            varients
        `;

    // Execute the query to get variants for the current product
    const varients = await new Promise((resolve, reject) => {
      connection.query(getVariantsQuery, (err, result) => {
        if (err) reject(err);

        // Process options and varient_values
        const processedVariants = result.map((variant) => {
          const options = JSON.parse(variant.options);
          const varientValues = JSON.parse(variant.varient_values);

          // Create an object with keys from options and values from varient_values
          const variantObj = { ...variant };
          for (let j = 0; j < options?.length; j++) {
            variantObj[options[j]] = varientValues[j];
          }

          return variantObj;
        });

        resolve(processedVariants);
      });
    });

    return res.status(200).json(varients);
  } catch (error) {
    return res
      .status(500)
      .json({ error: { msg: "Uncatchable Error Occurred" } });
  }
};

module.exports.activeMultipleProducts = async (req, res) => {
  const productIds = req.body;

  const idString = productIds.join(",");

  try {
    const insertCategory = `UPDATE products SET is_active = ${true} where id IN (${idString})`;
    connection.query(insertCategory, function (err, result) {
      if (err) throw err;

      return res.status(200).json({
        success: { msg: "Selected products active Successfully!" },
      });
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.deactiveMultipleProducts = async (req, res) => {
  const productIds = req.body;

  const idString = productIds.join(",");

  try {
    const insertCategory = `UPDATE products SET is_active = ${false} where id IN (${idString})`;
    connection.query(insertCategory, function (err, result) {
      if (err) throw err;

      return res.status(200).json({
        success: { msg: "Selected products deactive Successfully!" },
      });
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.delProductImage = async (req, res) => {
  const { imgId } = req.params;

  try {
    const insertCategory = `UPDATE product_images SET is_delete = ${true} where id = ${imgId}`;
    connection.query(insertCategory, function (err, result) {
      if (err) throw err;

      return res.status(200).json({
        success: { msg: "Selected products active Successfully!" },
      });
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};

module.exports.getSpecificVarientByProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const getVariantsQuery = `
          SELECT
            id AS varient_id,
            virtual_id AS id,
            product_id,
            options,
            varient_values,
            price,
            quantity,
            discount,
            purchase_price AS purchasePrice
          FROM 
            varients
          WHERE 
            product_id = ${id};
        `;

    // Execute the query to get variants for the current product
    const varients = await new Promise((resolve, reject) => {
      connection.query(getVariantsQuery, (err, result) => {
        if (err) reject(err);

        // Process options and varient_values
        const processedVariants = result.map((variant) => {
          const options = JSON.parse(variant.options);
          const varientValues = JSON.parse(variant.varient_values);

          // Create an object with keys from options and values from varient_values
          const variantObj = { ...variant };
          for (let j = 0; j < options?.length; j++) {
            variantObj[options[j]] = varientValues[j];
          }

          return variantObj;
        });

        resolve(processedVariants);
      });
    });

    return res.status(200).json(varients);
  } catch (error) {
    return res
      .status(500)
      .json({ error: { msg: "Uncatchable Error Occurred" } });
  }
};

module.exports.getAllVarients = async (req, res) => {
  try {
    const getVariantsQuery = `
          SELECT
            id AS varient_id,
            virtual_id AS id,
            product_id,
            options,
            varient_values,
            price,
            quantity,
            purchase_price AS purchasePrice
          FROM 
            varients
        `;

    // Execute the query to get variants for the current product
    const varients = await new Promise((resolve, reject) => {
      connection.query(getVariantsQuery, (err, result) => {
        if (err) reject(err);

        // Process options and varient_values
        const processedVariants = result.map((variant) => {
          const options = JSON.parse(variant.options);
          const varientValues = JSON.parse(variant.varient_values);

          // Create an object with keys from options and values from varient_values
          const variantObj = { ...variant };
          for (let j = 0; j < options?.length; j++) {
            variantObj[options[j]] = varientValues[j];
          }

          return variantObj;
        });

        resolve(processedVariants);
      });
    });

    return res.status(200).json(varients);
  } catch (error) {
    return res
      .status(500)
      .json({ error: { msg: "Uncatchable Error Occurred" } });
  }
};

module.exports.getArticleNumForProduct = async (req, res) => {
  try {
    const getCategory = `SELECT MAX(id) AS last_id FROM products`;
    connection.query(getCategory, function (err, result) {
      if (err) throw err;

      return res
        .status(200)
        .json(String(result[0].last_id + 1).padStart(5, "0"));
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};
