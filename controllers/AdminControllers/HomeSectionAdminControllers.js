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


module.exports.getOurWorkSection = async (req, res) => {
  try {
  
    const insertTerms = `select * from our_work_section`;
    const result = await query(insertTerms);
    return res.status(200).json(result);
    
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



