const express = require('express')
const cookieParser = require('cookie-parser')
const router = express.Router();
const crypto = require('crypto');



router.post('/register', (req, res) => {
  const password = req.body.pw
  const hashPassword = crypto.createHash('sha512').update(password).digest("hex");


  let query = `INSERT INTO users(firstName, lastName, emailAddress, PhoneNumber, password) VALUES ('${req.body.firstName}','${req.body.lastName}','${req.body.email}', '${req.body.phone}', '${hashPassword}')`;
  connection.query(query, (err, result) => {
    if(err) {
        res.status(400);
    } else {
      res.send(200) // we have here an object that has only the inserted id  
    }
});
});


module.exports = router;



// let query = `INSERT INTO users (firstName, lastName, emailAddress, PhoneNumber, password) VALUES ('${req.body.firstName}','${req.body.lastName}','${req.body.email}', '${req.body.phone}', '${hashPassword}');`

// connection.query(query, (err,result)=>{
//   return res.send(200)
// })

// connection.query(`INSERT INTO users (firstName, lastName, emailAddress, PhoneNumber, password) VALUES ('${req.body.firstName}','${req.body.lastName}','${req.body.email}', '${req.body.phone}', '${hashPassword}')`, (err,result)=>{
//   return res.send(200)
// })