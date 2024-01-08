var connection = require("../../utils/connection");
const fileService = require("../file/file");

const dashboard = {
  getLatestMediaByType: async function (req, res) {
    try {
      let mediaType = req.params.mediaType;
      let query =
        "SELECT * from media  WHERE  isActive = 1 AND isApproved=1 AND MediaType = ? ORDER BY CreatedDate DESC LIMIT 8 ";
      let response = await connection.query(query, [mediaType]);

      await Promise.all(
        response.map(async (media) => {
          let demoFilePathObj = await fileService.getDemoFile(media.Id);
          if (demoFilePathObj && Object.keys(demoFilePathObj).length > 0) {
            media.DemoFilePath = demoFilePathObj.FilePath;
          } else {
            media.DemoFilePath = null;
          }

          return media;
        })
      );

      res.status(200).send({ data: response });
    } catch (e) {
      console.log("Error", e);
      res.status(500).send({ message: "Internal Server Error" });
    }
  },
};

module.exports = dashboard;
