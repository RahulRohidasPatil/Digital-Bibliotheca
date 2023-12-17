var connection = require("../../utils/connection");

const dashboard = {
  getLatestMediaByType: async function (req, res) {
    try {
      let mediaType = req.params.mediaType;
      let query =
        "SELECT * from media WHERE isActive = 1 AND isApproved=1 AND MediaType = ? ORDER BY CreatedDate DESC LIMIT 8 ";
      let response = await connection.query(query, [mediaType]);
      res.status(200).send({ data: response });
    } catch (e) {
      console.log("Error", e);
      res.status(500).send({ message: "Internal Server Error" });
    }
  },
};

module.exports = dashboard;
