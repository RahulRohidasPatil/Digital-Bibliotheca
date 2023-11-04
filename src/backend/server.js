const express = require('express')
const mysql = require('mysql2');
require('dotenv').config()

const app = express()
const port = 3000

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/users', (req, res) => {
  connection.query(
    'select * from user',
    function (err, results) {
      if (err) res.json(err)
      res.json(results)
    }
  );
})

app.listen(port, () => {
  console.log(`GDSD app listening on port ${port}`)
})