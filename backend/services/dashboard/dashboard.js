var connection = require("../../utils/connection");
const fileService = require("../file/file");

const dashboard = {
  getLatestMediaByType: async function (req, res) {
    try {
      let mediaType = req.params.mediaType;
      let userId = req.headers.userid;

      let query =
        "SELECT * from media m WHERE  isActive = 1 AND isApproved=1 AND isReported =0 AND MediaType = ? AND m.Id NOT IN (SELECT MediaID from reportedmedia WHERE ReportedBy = ?) ORDER BY CreatedDate DESC LIMIT 8 ";
      console.log(req.headers);
      let response = await connection.query(query, [mediaType, userId]);

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
