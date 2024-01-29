const mysql = require("mysql2");
require("dotenv").config();
var util = require("util");

var local_config = {
  host: process.env.MYSQL_LOCAL_HOST,
  user: process.env.MYSQL_LOCAL_USER,
  password: process.env.MYSQL_LOCAL_PASSWORD,
  database: process.env.MYSQL_LOCAL_DATABASE,
};

var production_config = {
  host: process.env.MYSQL_PROD_HOST,
  user: process.env.MYSQL_PROD_USER,
  password: process.env.MYSQL_PROD_PASSWORD,
  database: process.env.MYSQL_PROD_DATABASE,
};

var environment = process.env.ENVIRONMENT;

/*
  Peer Review for Amar's code by Parsa
    This is all good for now, but in case we go for multiple environments, like staging,
    its better to use switch-case to set environment configs.

    Peer Review Reply (Amar) - Okay I have added this check in switch case below now.Thanks for pointing it out. 
*/

var config = null;
switch (environment) {
  case "production":
    config = production_config;
    break;
  case "local":
    config = local_config;
    break;
  default:
    config = local_config;
    break;
}

var connection = mysql.createConnection(config);

function reconnect(connection) {
  console.log("\n New connection tentative...");
  //- Destroy the current connection variable
  if (connection) connection.destroy();
  //- Create a new one
  var connection = mysql.createConnection(config);

  //- Try to reconnect
  connection.connect(function (err) {
    if (err) {
      //- Try to connect every 1 seconds.
      setTimeout(reconnect, 2000);
    } else {
      console.log("\n\t *** New connection established with the database. ***");
      return connection;
    }
  });
}

connection.on("error", function (err) {
  console.log(err);
  //- The server close the connection.
  console.log(
    "/!\\ Cannot establish a connection with the database. /!\\ (" +
      err.code +
      ")"
  );
  console.error(
    "/!\\ Cannot establish a connection with the database. /!\\ (" +
      err.code +
      ")"
  );
  connection = reconnect(connection);
});

connection.query = util.promisify(connection.query); // Magic happens here.

module.exports = connection;
