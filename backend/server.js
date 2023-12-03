const express = require("express");
const cors = require("cors");
var routes = require("./routes/routes");


const app = express();
const port = 3000;

app.use(express.urlencoded({extended: 'false'}))
app.use(express.json())
app.use(cors());
app.options("*", cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  connection.query("select * from user", function (err, results) {
    if (err) res.json(err);
    res.json(results);
  });
});

app.use("/app", routes);

app.listen(port, () => {
  console.log(`GDSD app listening on port ${port}`);
});
