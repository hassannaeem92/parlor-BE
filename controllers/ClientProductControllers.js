const connection = require("../config/db");
const env = require("../global");

module.exports.getProducts = async (req, res) => {
  const { categoryId, subCategoryId } = req.body;
  if (categoryId && subCategoryId) {
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
          sc.id AS sub_category_id,
          sc.name AS sub_category_name,
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
          p.is_deleted = ${false} AND p.is_active = ${true} AND p.category_id = ${categoryId} AND p.sub_category_id = ${subCategoryId};
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

        return res.status(200).json(products);
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: { msg: "Uncatchable Error Occurred" } });
    }
  } else {
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
          sc.id AS sub_category_id,
          sc.name AS sub_category_name,
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
          p.is_deleted = ${false} AND p.is_active = ${true};
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

        return res.status(200).json(products);
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: { msg: "Uncatchable Error Occurred" } });
    }
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
        sc.id AS sub_category_id,
        sc.name AS sub_category_name,
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
       p.id = ${id} AND p.is_deleted = ${false} AND p.is_active = ${true}
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

module.exports.getCategoriesWithSubCategories = async (req, res) => {
  try {
    const getCategoriesQuery = `SELECT id, name,description,description2,imagePath FROM categories WHERE is_delete = ${false}`;

    connection.query(getCategoriesQuery, async (err, categories) => {
      if (err) throw err;

      for (let i = 0; i < categories?.length; i++) {
        const categoryId = categories[i].id;
        const getSubCategoriesQuery = `SELECT id, name FROM sub_categories WHERE category_id = ${categoryId} AND is_delete = ${false};`;

        // Execute the query to get variants for the current product
        const subCategories = await new Promise((resolve, reject) => {
          connection.query(getSubCategoriesQuery, (err, result) => {
            if (err) reject(err);

            // Process options and varient_values

            resolve(result);
          });
        });

        // Add the processed variants to the current product
        categories[i].subCategories = subCategories;
      }
      return res.status(200).json(categories);
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: { msg: "Uncatchable Error Occurred" } });
  }
};

function query(sql) {
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
}

module.exports.getPricesByCategory = async (req, res) => {
  try {
    const {
      serviceid
    } = req.body;
  
      const getQuery  = `      
           Select 
 			c.name AS service_name,
      c.description as service_description,
      c.description2 as service_description2,
			sc.name AS sub_service_name,
			sp.*
         from serviceprices sp
          left join categories c
          on c.id = sp.serviceid
          left join sub_categories sc
          on sc.id = sp.subserviceid
          WHERE c.id = ${serviceid}`;
      const result = await query(getQuery);
      return res.status(200).json(result);
  
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }  
};


module.exports.getAllServicePrices = async (req, res) => {
  try {
    const {
      serviceid
    } = req.body;
  
      const getQuery  = `      
           Select 
 			c.name AS service_name,
      c.description as service_description,
			sc.name AS sub_service_name,
			sp.*
         from serviceprices sp
          left join categories c
          on c.id = sp.serviceid
          left join sub_categories sc
          on sc.id = sp.subserviceid`;
      const result = await query(getQuery);
      return res.status(200).json(result);
  
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }  
};

