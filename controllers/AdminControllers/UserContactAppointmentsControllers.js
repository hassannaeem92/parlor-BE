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

module.exports.getContacts = async (req, res) => {
  try {
      
      const get_all_contacts_query = `select * from contact_us`;
      const get_all_contacts = await query(get_all_contacts_query);
      return res.status(200).json(get_all_contacts);

  } catch (error) {
    // return error
    return res
      .status(500)
      .json({ error: { msg: "Uncatchable Error Occurred" } });
  }
};


module.exports.getContactById = async (req, res) => {
  
  const { id } = req.params;
  try {
      
      const get_specific_contact_query = `select * from contact_us where id = ${id}`;
      const get_specific_contact = await query(get_specific_contact_query);
      return res.status(200).json(get_specific_contact);
  } catch (error) {
    // return error
    return res
      .status(500)
      .json({ error: { msg: "Uncatchable Error Occurred" } });
  }
};





// module.exports.addServicePrices = async (req, res) => {
//     // set body for insertion
//     try {
//       const {
//         serviceid,
//         subserviceid,
//         description,
//         price,
//         createdby
//       } = req.body;

//     let filePath = '';
//       if(req.files) {
//         req.files.map((file) => {
//           filePath = `/${file.filename}`
//         })
//      }
//      console.log("file is: ", filePath)
//     // check primary key already exsist or not
//     // primary key is both serviceid and subserviceid  ?? means category and sub category
//       const chectServicePriceKey  = `Select count(*) as count from serviceprices where serviceid = ${serviceid} and subserviceid = ${subserviceid }`
//       const getServiceprice = await query(chectServicePriceKey);
//       console.log(getServiceprice)
//       console.log(getServiceprice[0].count)
//       if(getServiceprice[0].count == 0) {
//         // get current date
//         const currentDate = new Date();
//         const formattedDate = currentDate.toISOString().split('T')[0];
//         // insert service price  
//         const insertServicePriceQuery  = `
//         INSERT INTO serviceprices (serviceid,subserviceid,description,price,createdby,createdDate,imagePath) 
//         VALUES (${serviceid},${subserviceid},"${description}",${price},${createdby},${formattedDate},"${filePath}")`
//         await query(insertServicePriceQuery);
//         return res.status(200).json({
//             success: { msg: "Service Prices added Successfully!" },
//           });
//       }else{
//         return res.status(200).json({
//             success: { msg: "Service Price Already Exist." },
//           });
//       }
    
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
//     }  
//   };

// module.exports.getServicePrices = async (req, res) => {
//     try {
//         const getServicePricesQuery = `
//           Select sp.*,c.name AS service_name,sc.name AS sub_service_name 
//            from serviceprices sp
//           left join categories c
//           on c.id = sp.serviceid
//           left join sub_categories sc
//           on sc.id = sp.subserviceid
//           `;
//         const getAllServiceprices = await query(getServicePricesQuery);
//         return res.status(200).json(getAllServiceprices);
      
//     } catch (error) {
//       return res
//         .status(500)
//         .json({ error: { msg: "Uncatchable Error Occurred" } });
//     }
//   };

// module.exports.getSpecificServicePrices = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const getServicePricesQuery = `
//        Select * from serviceprices a where a.id = ${id} 
//       `;
//     const getServiceprices = await query(getServicePricesQuery);
//     return res.status(200).json(getServiceprices);
  
// } catch (error) {
//   return res
//     .status(500)
//     .json({ error: { msg: "Uncatchable Error Occurred" } });
// }
// };

// module.exports.updateServicePrices = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const {
//       serviceid,
//       subserviceid,
//       description,
//       price,
//       createdby
//     } = req.body;
  
//   // check primary key already exsist or not
//   // primary key is both serviceid and subserviceid  ?? means category and sub category
//     const chectServicePriceKey  = `Select count(*) as count, imagePath from serviceprices where id = ${id}`
//     const getServiceprice = await query(chectServicePriceKey);
//     if(getServiceprice[0].count > 0) {
//       //unlinking file
//       console.log("data: ", getServiceprice[0])
//       const output = getServiceprice[0]?.imagePath ? deleteFile(getServiceprice[0].imagePath) : '';
//       let filePath = '';
//       if(req.files) {
//         req.files.map((file) => {
//           filePath = `/${file.filename}`
//         })
//      }
//      console.log("file is: ", filePath)
//       // get current date
//       const currentDate = new Date();
//       const formattedDate = currentDate.toISOString().split('T')[0];
//       // insert service price  
//       const insertServicePriceQuery  = `
//       UPDATE serviceprices set serviceid = ${serviceid}, subserviceid = ${subserviceid},
//         description = "${description}",
//         price = ${price},
//         createdby = ${createdby},
//         imagePath = "${filePath}"
//         where id = ${id}
//       `;

//       await query(insertServicePriceQuery);
//       return res.status(200).json({
//           success: { msg: "Service Prices updated Successfully!" },
//         });
//     }else{
//       return res.status(200).json({
//           success: { msg: "Service Price Already Exist." },
//         });
//     }
  
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
//   }  
// };

// const deleteFile = (filename) => {
//   const filePath = path.join(__dirname, 'public', 'uploads', filename);
//   console.log("filepath is: ", filePath)
//   // Use fs.unlink() to delete the file
//   fs.unlink(filePath, (err) => {
//     if (err) {
//       console.error('Error deleting the file:', err);
//       return;
//     }
//     console.log('File deleted successfully');
//   });
// };
