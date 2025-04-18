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


module.exports.addDeals = async (req, res) => {
    // set body for insertion
    try {
      const {
        dealName,
        dealPrice,
        dealDescription,
        image,
        services
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

      if(services?.length > 0){
      const checkdealsName  = `Select count(*) as count from service_deals where deal_name = "${dealName.toLowerCase()}" `
      const getdealsCount = await query(checkdealsName);
      // console.log(getServiceprice)
      // console.log(getServiceprice[0].count)
      if(getdealsCount[0].count == 0) {
        // get current date
        // const currentDate = new Date();
        // const formattedDate = currentDate.toISOString().split('T')[0];
        // insert service price  
        const insert_deals_query  = `
        INSERT INTO service_deals (deal_name,deal_price,deal_description,image) 
        VALUES (
        "${dealName}",
         ${dealPrice},
        "${dealDescription}","${filePath}")`
        const new_record = await query(insert_deals_query);
        services_array = JSON.parse(services)
        console.log("services",services_array[0])
          for (let service of services_array) {
            console.log(service.serviceid)
            let insert_services_query  = `
             INSERT INTO services (serviceid,subserviceid,description,service_deal_id) 
             VALUES (${service.serviceid},${service.subserviceid},"${service.description}",${new_record.insertId})`
            await query(insert_services_query);
          }
        
              return res.status(200).json({
                  success: { msg: "Deals added Successfully!" },
                });
          }else{
        return res.status(200).json({
            success: { msg: "Deals is Already Exist." },
          });
      }
    }else{
        return res.status(200).json({
            success: { msg: "Please Enter at Least one Service" },
          });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
    }  
  };

module.exports.getDeals = async (req, res) => {
    try {
        const get_all_deals = [];
        const one_serives_deal = [];
        const get_all_deals_query = `select * from service_deals`;
        const get_all_service_deals = await query(get_all_deals_query);
        if(get_all_service_deals?.length > 0){
          
          for (one_service_Deal in get_all_service_deals)
            {
              const deal_id = get_all_service_deals[one_service_Deal].id
              const get_all_service_by_deal_query = `select * from services a where a.service_deal_id = ${deal_id} `;
              const get_all_services_by_deal = await query(get_all_service_by_deal_query);
              get_all_service_deals[one_service_Deal].services  = get_all_services_by_deal
              one_serives_deal.push(get_all_service_deals[one_service_Deal]) 
            }
            get_all_deals.push(one_serives_deal)
        }

        return res.status(200).json(get_all_deals[0]);
      
    } catch (error) {
      return error
      // return res
      //   .status(500)
      //   .json({ error: { msg: "Uncatchable Error Occurred" } });
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
    console.log(get_all_deal_by_id)
    const get_services_by_id_query = `SELECT * FROM services a WHERE a.service_deal_id = ${id}`;
    const get_all_services_by_id = await query(get_services_by_id_query);
    console.log(get_all_services_by_id)
    get_all_deal_by_id[0].servies = get_all_services_by_id;

    return res.status(200).json(get_all_deal_by_id);
  
} catch (error) {
  return res
    .status(500)
    .json({ error: { msg: "Uncatchable Error Occurred" } });
}
};

module.exports.updateDeals = async (req, res) => {
  const { id } = req.params;
  
  try {
    const {
      dealName,
      dealPrice,
      dealDescription,
      services
    } = req.body;
  
  // check primary key already exsist or not
  // primary key is both serviceid and subserviceid  ?? means category and sub category
    const check_deal_exist_query  = `Select count(*) as count, image from service_deals where id = ${id}`
    const get_deal_count = await query(check_deal_exist_query);
    if(get_deal_count[0].count > 0) {
      //unlinking file
      const output = get_deal_count[0]?.image ? deleteFile(get_deal_count[0].image) : '';
      let filePath = '';
      if(req.files) {
        req.files.map((file) => { filePath = `/${file.filename}`})
     }
     console.log("file is: ", filePath)
      // get current date
      // const currentDate = new Date();
      // const formattedDate = currentDate.toISOString().split('T')[0];
      // insert service price  
      const update_deals_query  = `
      UPDATE service_deals set 
        deal_name = "${dealName}", 
        deal_price = ${dealPrice},
        deal_description = "${dealDescription}",
        image = "${filePath}"
        where id = ${id}
      `;

      await query(update_deals_query);

      // delete all old services
      const delete_services_query  = `
    DELETE FROM services where service_deal_id = ${id}`;

      await query(delete_services_query);
      

      if(services.length > 0){
          services_array = JSON.parse(services)
          for (let service of services_array) {
            let insert_services_query  = `
            INSERT INTO services (serviceid,subserviceid,description,service_deal_id) 
            VALUES (${service.serviceid},${service.subserviceid},"${service.description}",${id})`
           await query(insert_services_query);
          }
        }    

      return res.status(200).json({
          success: { msg: "Deals updated Successfully!" },
        });
    }else{
      return res.status(200).json({
          success: { msg: "Deal Already Exist." },
        });
    }
  
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }  
};

const deleteFile = (filename) => {
  const filePath = path.join(__dirname,"../../", 'public', 'uploads', filename);
  console.log("filepath is: ", filePath)
  // Use fs.unlink() to delete the file
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Error deleting the file:', err);
      return;
    }
    console.log('File deleted successfully');
  });
};
