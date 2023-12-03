var connection = require("../../utils/connection");
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);

const auth = {
  register: async function (req, res) {
    try {
      console.log(req);
      const hashedPassword = bcrypt.hashSync(req.body.password, salt);
      let query =
        "INSERT into user(`firstName`,`familyName`,`emailAddress`,`password`,`phoneNumber`,`DateOfBirth`,`role`,`CreatedDate`) VALUES (?, ?, ?, ?, ?, STR_TO_DATE(?, '%Y-%m-%d'), ?, CURRENT_DATE())";
      const values = [
        (firstName = req.body.firstName),
        (familyName = req.body.lastName),
        (email = req.body.emailAddress),
        (password = hashedPassword),
        (phoneNumber = req.body.phoneNumber),
        (DateOfBirth = req.body.DateOfBirth),
        (role = req.body.role),
      ];
      connection.query(query, values, (err, data) => {
        if (err) {
          // console.log(err)
          return res.json(err);
        }
        console.log("User registered successfully");
        res.redirect("auth/login");
        return res.json(data);
      });
    } catch (e) {
      // console.log("Error", e);
      res.status(500).send({ message: "Internal Server Error" });
    }
  },

  login: function (req, res) {
    const { emailAddress, password } = req.body;
    const query = "SELECT * FROM user WHERE emailAddress = ?";
    connection.query(query, [emailAddress], (err, results) => {
      if (err) {
        console.error("Error querying user: " + err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.length === 0) {
        // User not found
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Compare the provided password with the hashed password from the database
      const hashedPassword = results[0].password;

      bcrypt.compare(password, hashedPassword, (bcryptErr, match) => {
        if (bcryptErr) {
          console.error("Error comparing passwords: " + bcryptErr);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        if (!match) {
          // Passwords do not match
          return res.status(401).json({ error: "Invalid credentials" });
        }

        // Successful login
        return res.json({ message: "Login successful" });
      });
    });
  },
};

module.exports = auth;
