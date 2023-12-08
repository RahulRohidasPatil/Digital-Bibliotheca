var connection = require("../../utils/connection");

const media = {
  getAllMedia: async function (req, res) {
    try {
      let query = "SELECT * from media WHERE isActive = 1 AND isApproved=1";
      let response = await connection.query(query);
      res.status(200).send({ data: response });
    } catch (e) {
      console.log("Error", e);
      res.status(500).send({ message: "Internal Server Error" });
    }
  },
  search: async function (req, res) {
    var searchTerm = req.body.searchTerm;
    console.log(searchTerm);
    try {
      console.log(searchTerm);
      let query =
        "SELECT * from media WHERE( title LIKE ? OR description LIKE ?) AND  isActive = 1 AND isApproved=1";
      let values = [`%${searchTerm}%`, `%${searchTerm}%`];
      let response = await connection.query(query, values);
      res.status(200).send({ data: response });
    } catch (e) {
      console.log("Error", e);
      res.status(500).send({ message: "Internal Server Error" });
    }
  },
  getMedia: async function (req, res) {
    try {
      const id = req.params.id;
      let query = `SELECT * from media WHERE Id=${id}`;
      let response = await connection.query(query);
      res.status(200).send({ data: response[0] });
    } catch (e) {
      console.log("Error", e);
      res.status(500).send({ message: "Internal Server Error" });
    }
  }
};

module.exports = media;
