const express = require('express')
const mysql = require ('mysql')
const app = express()
const port = 8000
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');
const router = express.Router();
const crypto = require('crypto');
const cors = require('cors')

// const indexRouter = require('./routes');
// const userRouter = require('./routes/user');
// const registerRouter = require('./routes/register')
// const loginRouter = require('./routes/login')


let corsOptions = {
  origin: '*',
  credential: true, 
}
app.use(cors(corsOptions))


// app.use('/', indexRouter);
// app.use('/user', userRouter);
// app.use('/register', registerRouter);
// app.use('/login', loginRouter);



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser())



let connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'Sonny0401@',
  database: 'jbhifi'
});



connection.connect(function(err) {
  if (err) {

    return console.error('error: ' + err.message);
  }

  console.log('Connected to the MySQL server.');
});




app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);


app.get('/', (req, res) => {
  res.render('index.html')
});


app.post('/register', (req, res) => {
  const password = req.body.pw
  const hashPassword = crypto.createHash('sha512').update(password).digest("hex");

  let qq = `select * from users where emailAddress = '${req.body.email}'`;
  connection.query(qq, (err, result) => {
    if (result.length >= 1){
      return res.status(409).send({
        code : 409,
        message: 'Email address already exists'
       })
     } else {
      let query = `INSERT INTO users(firstName, lastName, emailAddress, PhoneNumber, password) VALUES ('${req.body.firstName}','${req.body.lastName}','${req.body.email}', '${req.body.phone}', '${hashPassword}')`;
      connection.query(query, (err, result) => {
          return res.status(200).send({
            code : 200,
            message: 'User created successfully'
          })  
      });
     }
  });
}); 


app.post('/login', (req, res) => {
  const password = req.body.pw

  const hashPassword = crypto.createHash('sha512').update(password).digest("hex");

  connection.query(`select * from users where emailAddress = '${req.body.email}' and password = '${hashPassword}'`, (err,result)=>{
  if (result === undefined || result.length === 0){
    return res.send({
      code : 400,
      message : 'User is defined'
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



app.post('/removeCookie', (req, res) => {
  res.clearCookie('user')
  res.redirect('/')
  });



app.get('/productMain', (req, res) => {
  connection.query('select * from product', (err,result)=>{
    console.log('productMain')
    res.send(result)
})
})

app.get('/productDetail/:id', (req, res) => {
  console.log(req.params,'paramssss')
  
  connection.query(`SELECT * FROM product WHERE id = '${req.params.id}'` ,(err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      console.log('No product found');
      res.send('No product found');
    } else {
      console.log(result[0]);
      console.log('Product Detail');
      res.send(result[0]);
    }
  })
});

// app.get('/')

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

