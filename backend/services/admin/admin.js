var connection = require("../../utils/connection");
const formidable = require("express-formidable");

const {
  applyFiltersOnQuery,
  applySortOptionOnQuery,
} = require("../../utils/utils");

const fileService = require("../file/file");

const adminService= {
  getUnapprovedMedia: async function (req, res) {
    const sortOption = req.query.sortOption;

    try {
      let query = "SELECT * from media WHERE isActive = 1 AND isApproved=0";

      if (req.query.filters) {
        const filters = JSON.parse(req.query.filters);
        query = applyFiltersOnQuery(query, filters);
      }
      query = applySortOptionOnQuery(query, sortOption);

      let response = await connection.query(query);

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

      res.status(200).send(response);
    } catch (e) {
      console.log("Error", e);
      res.status(500).send({ message: "Internal Server Error" });
    }
  },
approveMedia : async function (req,res) {
    try{
       let query= "update media set `IsApproved` = ? WHERE `Id` = ?";
       const values = [
         req.body.IsApproved,
         req.body.Id
       ]
      console.log(req.body);
      let response = await connection.query(query, values);
      res.status(200).send({ data: response });

    }catch (e){
        console.log("Error", e);
        res.status(500).send({ message: "Internal Server Error" });

    }

},
getUsers: async function (req, res) {
  try{
      let query = "SELECT * FROM user";

      let result = await connection.query(query);

      res.status(200).send({data: result});
  }
  catch(e){
      res.status(500).send({ message: "Internal Server Error" });
  }
},
banUser: async function (req, res) {
  try{
      let query = "UPDATE user SET `Status` = 2 WHERE Id = ?";

      let values = [`${req.params.id}`]

      let result = await connection.query(query, values);

      res.status(200).send({data: result});
  }
  catch(e){
      res.status(500).send({ message: "Internal Server Error" });
  }
},
unbanUser: async function (req, res) {
  try{
      let query = "UPDATE user SET `Status` = 1 WHERE Id = ?";

      let values = [`${req.params.id}`]

      let result = await connection.query(query, values);

      res.status(200).send({data: result});
  }
  catch(e){
      res.status(500).send({ message: "Internal Server Error" });
  }
},
};
module.exports = admin;



