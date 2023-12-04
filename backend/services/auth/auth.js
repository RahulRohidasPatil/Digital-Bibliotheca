var connection = require("../../utils/connection");
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);

const auth = {
  register: async function (req, res) {
    try {
      const hashedPassword = bcrypt.hashSync(req.body.password, salt);
      let query =
        "INSERT into user(`firstName`,`familyName`,`emailAddress`,`password`,`phoneNumber`,`DateOfBirth`,`role`,`CreatedDate`) VALUES (?, ?, ?, ?, ?, STR_TO_DATE(?, '%Y-%m-%d'), ?, CURRENT_DATE())";
      const values = [
        (firstName = req.body.firstName),
        (familyName = req.body.lastName),
        (email = req.body.emailAddress),
        (password = hashedPassword),
        (phoneNumber = req.body.phone),
        (DateOfBirth = req.body.DateOfBirth),
        (role = req.body.role),
      ];
      let response = await connection.query(query, values);
      return res.json(response);
    } catch (e) {
      console.log("Error", e);
      if (e.code == "ER_DUP_ENTRY") {
        return res
          .status(400)
          .send({ message: "Email Address already present. Please Login!" });
      }
      return res.status(500).send({ message: "Internal Server Error" });
    }
  },

  login: function (req, res) {
    const { emailAddress, password } = req.body;
    const query = "SELECT * FROM user WHERE emailAddress = ?";
    connection.query(query, [emailAddress], (err, results) => {
      if (err) {
        console.error("Error querying user: " + err);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      if (results.length === 0) {
        // User not found
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Compare the provided password with the hashed password from the database
      const hashedPassword = results[0].Password;
      bcrypt.compare(password, hashedPassword, (bcryptErr, match) => {
        if (bcryptErr) {
          console.error("Error comparing passwords: " + bcryptErr);
          return res.status(500).json({ message: "Internal Server Error" });
        }

        if (!match) {
          // Passwords do not match
          return res.status(401).json({ message: "Invalid credentials" });
        }

        // Successful login
        return res.json({ message: "Login successful" });
      });
    });
  },
};

module.exports = auth;
