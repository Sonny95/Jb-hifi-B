const express = require('express');

const router = express.Router();

router.post('/login', (req, res) => {

  const password = req.body.pw

  const hashPassword = crypto.createHash('sha512').update(password).digest("hex");

  connection.query(`select * from users where emailAddress = '${req.body.email}' and password = '${hashPassword}'`, (err,result)=>{
  if (result === undefined || result.length === 0){
    return res.send({
      code : 400
     })
   }

   const token = jwt.sign(
    { 
      type: 'JWT'
     },
      'secret-key', 
      { 
        expiresIn: '15m' 
      }, 
      (err, token) => {
        return res.send({code : 200, token : token });
    });
})
})
module.exports = router;