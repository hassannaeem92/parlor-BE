const connection = require("../config/db");


function query(sql) {
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
}





module.exports.addContact = async (req, res) => {
  console.log("nweonrnebter  isdhfisdfub io")
  const {
    name,
    phoneNumber,
    description,
    appointmentDate,
    address,
    serviceid,
    appointmentTime,
    numberOfPersons,
    createdBy,
    createdAt
  } = req.body;

  try {
    const insertTerms = `INSERT INTO contact_us (name, phone, description,appointment_date,
    address,serviceid,appointment_time,number_of_persons,created_by, created_at) 
    VALUES (?,?,?,?,?,?,?,?,?,?)`;
    const values = [name, phoneNumber, description, appointmentDate, 
      address,serviceid,appointmentTime,numberOfPersons,createdBy,createdAt];
    connection.query(insertTerms, values, function (err, result) {
      if (err) throw err;
      return res
        .status(200)
        .json({ success: { msg: "Your Appointment request submitted Successfully!" } });
    });
  } catch (error) {
    return res.status(500).json({ error: { msg: "Uncatchable Error Occur" } });
  }
};




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



