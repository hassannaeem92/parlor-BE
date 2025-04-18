const connection = require("../config/db");
const fs = require('fs');
const path = require('path');

// module.exports.getSpecificUser = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const getCategory = `SELECT * FROM users WHERE id = ?`;
//     connection.query(getCategory, [id], function (err, result) {
//       if (err) {
//         console.error("Error while fetching user:", err);
//         return res
//           .status(500)
//           .json({ error: { msg: "An error occurred while fetching user" } });
//       }

//       return res.status(200).json(result[0]);
//     });
//   } catch (error) {
//     console.error("Uncatchable error occurred:", error);
//     return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
//   }
// };

// module.exports.updateUser = async (req, res) => {
//   const {
//     fname,
//     lname,
//     email,
//     isActive,
//     userId,
//     phone,
//     shipping_address1,
//     billing_address1,
//     country,
//     state,
//     city,
//     zip,
//     apt,
//     street,
//     ccv,
//     expiryDate,
//     cardName,
//     cardNumber,
//   } = req.body;
//   const { id } = req.params;

//   try {
//     const updateCategory = `
//       UPDATE users 
//       SET name = ?, last_name = ?, email = ?,
//           phone = ?, shipping_address1 = ?, billing_address1 = ?,country=?,city=?,state=?,street=?,zip_code=?,apt=?,ccv=?,expire_date=?,card_name=?,card_number=?
//       WHERE id = ?
//     `;
//     const values = [
//       fname,
//       lname,
//       email,
//       phone,
//       shipping_address1,
//       billing_address1,

//       country,
//       city,
//       state,
//       street,
//       zip,
//       apt,
//       ccv,
//       expiryDate,
//       cardName,
//       cardNumber,
//       id,
//     ];

//     connection.query(updateCategory, values, function (err, result) {
//       if (err) {
//         console.error("Error while updating user:", err);
//         return res
//           .status(500)
//           .json({ error: { msg: "An error occurred while updating user" } });
//       }

//       return res
//         .status(200)
//         .json({ success: { msg: "User updated Successfully!" } });
//     });
//   } catch (error) {
//     console.error("Uncatchable error occurred:", error);
//     return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
//   }
// };

// module.exports.updateUserPic = async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: { msg: "No file uploaded" } });
//   }

//   const img = req.file.filename;
//   const { id } = req.params;

//   try {
//     const imgQuery = `UPDATE users SET image = ? WHERE id = ?`;
//     connection.query(imgQuery, [img, id], (err, result) => {
//       if (err) {
//         console.error("Error updating user image:", err);
//         return res
//           .status(500)
//           .json({ error: { msg: "Error uploading image" } });
//       } else {
//         return res
//           .status(200)
//           .json({ success: { msg: "Image uploaded successfully" } });
//       }
//     });
//   } catch (error) {
//     console.error("Uncaught error in updateUserPic:", error);
//     return res
//       .status(500)
//       .json({ error: { msg: "An unexpected error occurred" } });
//   }
// };


function query(sql) {
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
}


module.exports.addOurWorkSection = async (req, res) => {
  try {
  
    let filePath = '';
      if(req.files) {
        req.files.map(async (file) => {
        filePath = `/${file.filename}`
    const insertTerms = `INSERT INTO our_work_section (imagePath) VALUES ("${filePath}")`;
    await query(insertTerms);
  
  })
}
return res.status(200).json("Images Add Successfully!");    
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};




module.exports.updateOurWorkSection = async (req, res) => {
  const {
    id
  } = req.body;
  console.log("id",id)
  try {
    if(id.length > 0){
      console.log("in if id.length > 0")
      const get_all_image_by_id_query = `select imagePath from our_work_section where id IN (${id})`;
      const get_all_filename = await query(get_all_image_by_id_query);
      if(get_all_filename?.length>0){
      console.log("in if get_all_filename?.length>0")

        for(one_file_name of get_all_filename){
          console.log(one_file_name.imagePath)
           await deleteFile(one_file_name.imagePath)
        }
      }      
    }
    console.log("outside for loop")

    let filePath = '';
      if(req.files) {
        req.files.map(async (file) => {
        filePath = `/${file.filename}`
    const insertTerms = `INSERT INTO our_work_section (imagePath) VALUES ("${filePath}")`;
    await query(insertTerms);
    
    // connection.query(insertTerms, values, function (err, result) {
    //   if (err) throw err;
    //   return res
    //     .status(200)
    //     .json({ success: { msg: "Images add Successfully!" } });
    // });
  })
}
return res.status(200).json("Images Updated Successfully!");    
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};


// module.exports.getContacts = async (req, res) => {
//   try {
      
//       const get_all_contacts_query = `select * from contact_us`;
//       const get_all_contacts = await query(get_all_contacts_query);
//       return res.status(200).json(get_all_contacts);

//   } catch (error) {
//     // return error
//     return res
//       .status(500)
//       .json({ error: { msg: "Uncatchable Error Occurred" } });
//   }
// };


// module.exports.getContactById = async (req, res) => {
  
//   const { id } = req.params;
//   try {
      
//       const get_specific_contact_query = `select * from contact_us where id = ${id}`;
//       const get_specific_contact = await query(get_specific_contact_query);
//       return res.status(200).json(get_specific_contact);
//   } catch (error) {
//     // return error
//     return res
//       .status(500)
//       .json({ error: { msg: "Uncatchable Error Occurred" } });
//   }
// };



// module.exports.updateContact = async (req, res) => {
//   const { id } = req.params;
 
//   const {
//     name,
//     phoneNumber,
//     description,
//     appointmentDate,
//     address,
//     serviceid,
//     appointmentTime,
//     numberOfPersons,
//     createdBy,
//     createdAt
//   } = req.body;

//   try {
//     const insertTerms = `
//     UPDATE contact_us SET 
//     name = ${name}, 
//     phone = ${phoneNumber}, 
//     description = ${description},
//     appointment_date = ${appointmentDate},
//     address = ${address},
//     serviceid = ${serviceid},
//     appointment_time = ${appointmentTime},
//     number_of_persons = ${numberOfPersons},
//     created_by = ${createdBy},  
//     created_at = ${createdAt} 
//     `;
//     const values = [name, phoneNumber, description, appointmentDate, 
//       address,serviceid,appointmentTime,numberOfPersons,createdBy,createdAt];
//     connection.query(insertTerms, values, function (err, result) {
//       if (err) throw err;
//       return res
//         .status(200)
//         .json({ success: { msg: "Your Appointment request updated Successfully!" } });
//     });
//   } catch (error) {
//     return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
//   }
// };




const deleteFile = (filename) => {
  const filePath = path.join(__dirname,'./../', 'public', 'uploads', filename);
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

module.exports.getDeals = async (req, res) => {
  try {
        const get_all_service_by_deal_query = `select * from service_deals`;
        const get_all_services_by_deal = await query(get_all_service_by_deal_query);
      
      return res.status(200).json(get_all_services_by_deal);
    
  } catch (error) {
    return error
    // return res
    //   .status(500)
    //   .json({ error: { msg: "Uncatchable Error Occurred" } });
  }
};


module.exports.getOurWorkSection = async (req, res) => {
  try {
  
    const insertTerms = `select * from our_work_section`;
    const result = await query(insertTerms);
    return res.status(200).json(result);
    
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};


module.exports.getSpecificDealById = async (req, res) => {
  const { id } = req.params;
  try {
    const get_deal_by_id_query = `
        select id as id, deal_name as dealName, deal_description as description, 
        deal_price as dealPrice, image as imagePath
        FROM service_deals a WHERE id = ${id} 
      `;
    const get_all_deal_by_id = await query(get_deal_by_id_query);
    const get_services_by_id_query = `SELECT * FROM services a WHERE a.service_deal_id = ${id}`;
    const get_all_services_by_id = await query(get_services_by_id_query);
    get_all_deal_by_id[0].servies = get_all_services_by_id;

    return res.status(200).json(get_all_deal_by_id);
  
} catch (error) {
  return res
    .status(500)
    .json({ error: { msg: "Uncatchable Error Occurred" } });
}
};
