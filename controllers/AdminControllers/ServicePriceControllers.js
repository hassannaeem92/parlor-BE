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


module.exports.addServicePrices = async (req, res) => {
    // set body for insertion
    try {
      const {
        serviceid,
        subserviceid,
        description,
        price,
        createdby
      } = req.body;

    let filePath = '';
      if(req.files) {
        req.files.map((file) => {
          filePath = `/${file.filename}`
        })
     }
     console.log("file is: ", filePath)
    // check primary key already exsist or not
    // primary key is both serviceid and subserviceid  ?? means category and sub category
      const chectServicePriceKey  = `Select count(*) as count from serviceprices where serviceid = ${serviceid} and subserviceid = ${subserviceid }`
      const getServiceprice = await query(chectServicePriceKey);
      console.log(getServiceprice)
      console.log(getServiceprice[0].count)
      if(getServiceprice[0].count == 0) {
        // get current date
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split('T')[0];
        // insert service price  
        const insertServicePriceQuery  = `
        INSERT INTO serviceprices (serviceid,subserviceid,description,price,createdby,createdDate,imagePath) 
        VALUES (${serviceid},${subserviceid},"${description}",${price},${createdby},${formattedDate},"${filePath}")`
        await query(insertServicePriceQuery);
        return res.status(200).json({
            success: { msg: "Service Prices added Successfully!" },
          });
      }else{
        return res.status(200).json({
            success: { msg: "Service Price Already Exist." },
          });
      }
    
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
    }  
  };

module.exports.getServicePrices = async (req, res) => {
    try {
        const getServicePricesQuery = `
          Select sp.*,c.name AS service_name,sc.name AS sub_service_name 
           from serviceprices sp
          left join categories c
          on c.id = sp.serviceid
          left join sub_categories sc
          on sc.id = sp.subserviceid
          `;
        const getAllServiceprices = await query(getServicePricesQuery);
        return res.status(200).json(getAllServiceprices);
      
    } catch (error) {
      return res
        .status(500)
        .json({ error: { msg: "Uncatchable Error Occurred" } });
    }
  };

module.exports.getSpecificServicePrices = async (req, res) => {
  const { id } = req.params;
  try {
    const getServicePricesQuery = `
       Select * from serviceprices a where a.id = ${id} 
      `;
    const getServiceprices = await query(getServicePricesQuery);
    return res.status(200).json(getServiceprices);
  
} catch (error) {
  return res
    .status(500)
    .json({ error: { msg: "Uncatchable Error Occurred" } });
}
};

module.exports.updateServicePrices = async (req, res) => {
  const { id } = req.params;
  console.log("iddd",id)
  try {
    const {
      serviceid,
      subserviceid,
      description,
      price,
      createdby
    } = req.body;
  
  // check primary key already exsist or not
  // primary key is both serviceid and subserviceid  ?? means category and sub category
    const chectServicePriceKey  = `Select count(*) as count, imagePath from serviceprices where id = ${id}`
    const getServiceprice = await query(chectServicePriceKey);
    if(getServiceprice[0].count > 0) {
      //unlinking file
      let filePath = '';
      console.log(req.files)
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0];
      let insertServicePriceQuery = '';
      if(req.files.length > 0) {
        console.log("data: ", getServiceprice[0])
        const output = getServiceprice[0]?.imagePath ? await deleteFile(getServiceprice[0].imagePath) : '';
        console.log("output",output)  
        req.files.map((file) => {
          filePath = `/${file.filename}`
        })
         insertServicePriceQuery  = `
          UPDATE serviceprices set serviceid = ${serviceid}, subserviceid = ${subserviceid},
        description = "${description}",
        price = ${price},
        createdby = ${createdby},
        imagePath = "${filePath}"
        where id = ${id}
      `;
     }else{
      insertServicePriceQuery  = `
      UPDATE serviceprices set serviceid = ${serviceid}, subserviceid = ${subserviceid},
    description = "${description}",
    price = ${price},
    createdby = ${createdby}
    where id = ${id}
  `;
     }
    //  console.log("file is: ", filePath)
      // get current date
      // insert service price  
      
      
      




      await query(insertServicePriceQuery);
      return res.status(200).json({
          success: { msg: "Service Prices updated Successfully!" },
        });
    }else{
      return res.status(200).json({
          success: { msg: "Service Price Already Exist." },
        });
    }
  
  } catch (error) {
    console.error(error);
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

module.exports.deleteServicePrices = async (req, res) => {
  // set body for insertion
  try {
    const categoryIds = req.body;
    const idString = categoryIds.join(",");
 
      const insertServicePriceQuery  = `
      DELETE from serviceprices where id IN (${idString})
      `;
      await query(insertServicePriceQuery);
      return res.status(200).json({
          success: { msg: "Service Prices deleted Successfully!" },
        });
        
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }  
};



