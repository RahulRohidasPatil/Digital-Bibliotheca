var connection = require("../../utils/connection");
const formidable = require("express-formidable");

const {
  applyFiltersOnQuery,
  applySortOptionOnQuery,
} = require("../../utils/utils");

const fileService = require("../file/file");

const media = {
  getAllMedia: async function (req, res) {
    const sortOption = req.query.sortOption;

    try {
      let query = "SELECT * from media WHERE isActive = 1 AND isApproved=1";

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

      res.status(200).send({ data: response });
    } catch (e) {
      console.log("Error", e);
      res.status(500).send({ message: "Internal Server Error" });
    }
  },
  getByID: async function (req, res) {
    try {
      let query =
        "SELECT * from media WHERE `Id` = ? ";
      let response = await connection.query(query, [req.params.id]);

      let demoFilePathObj = await fileService.getDemoFile(req.params.id);
      if (demoFilePathObj && Object.keys(demoFilePathObj).length > 0) {
        response[0].DemoFilePath = demoFilePathObj.FilePath;
      } 

      res.status(200).send({ data: response });
    } catch (e) {
      console.log("Error", e);
      res.status(500).send({ message: "Internal Server Error" });
    }
  },
  addMedia: async function (req, res) {
    formidable({ multiples: true })(req, res, async (err) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: "Internal Server Error" });
      }
      let insertId = null;
      try {
        let query =
          "insert into media(`OwnerId`,`Title`,`Description`,`MediaType`,`IsApproved`,`Price`,`IsActive`,`CreatedDate`,`DemoFilePath`,`DeliveryMethod`) VALUES (?) ";
        const values = [
          req.user.Id,
          req.fields.Title,
          req.fields.Description,
          req.fields.MediaType,
          req.fields.IsApproved == 0,
          req.fields.Price,
          parseInt(req.fields.IsActive || 0),
          req.fields.CreatedDate,

          req.fields.DemoFilePath,
          req.fields.DeliveryMethod,
        ];
        let response = await connection.query(query, [values]);
        insertId = response.insertId;
        //Main files
        if (!Array.isArray(req.files.Files))
          req.files.Files = [req.files.Files];
        await fileService.uploadFile(req.files.Files, insertId);
        //Demo File
        if (!Array.isArray(req.files.DemoFile))
          req.files.DemoFile = [req.files.DemoFile];
        await fileService.uploadFile(req.files.DemoFile, insertId, true);

        if (insertId) {
          res
            .status(200)
            .send({ message: "Upload Successful", mediaId: insertId });
        } else {
          res
            .status(500)
            .send({ message: "Error Uploading Media please try again!!" });
        }
      } catch (e) {
        console.log("Error", e);
        //Incase the media gets added but the upload files function throws an error the below query removes the empty media entry
        if (insertId) {
          ("DELETE FROM media WHERE Id = insertId");
        }
        res.status(500).send({ message: "Internal Server Error" });
      }
    });
  },
  updateMedia: async function (req, res) {
    try {
      let query =
        "update media set `Title` = ?, `Description` = ?,  `Price` = ? WHERE `Id` = ?";
      const values = [
        req.body.Title,
        req.body.Description,
        req.body.Price,
        req.params.id,
      ];
      console.log(req.body);
      let response = await connection.query(query, values);
      res.status(200).send({ data: response });
    } catch (e) {
      console.log("Error", e);
      res.status(500).send({ message: "Internal Server Error" });
    }
  },
  deleteMedia: async function (req, res) {
    try {
      let query = "update media set `IsActive` = 0 WHERE `Id` = ?";
      let response = await connection.query(query, [req.params.id]);
      res.status(200).send({ data: response });
    } catch (e) {
      console.log("Error", e);
      res.status(500).send({ message: "Internal Server Error" });
    }
  },
  reactivateMedia: async function (req, res) {
    try {
      let query = "update media set `IsActive` = 1 WHERE `Id` = ?";
      let response = await connection.query(query, [req.params.id]);
      res.status(200).send({ data: response });
    } catch (e) {
      console.log("Error", e);
      res.status(500).send({ message: "Internal Server Error" });
    }
  },
  isOwner: async function (req, res){
    try{
      let query = "SELECT * FROM media WHERE Id = ? AND OwnerId = ?";
      let values = [`${req.query.id}`, `${req.query.ownerId}`];
      let response = await connection.query(query, values);

      res.status(200).send({data: response.length > 0});
    } catch(e){
      res.status(500).send({ message: "Internal Server Error" });
    }
  },
  purchased: async function(req, res){
    try{
      let query = "SELECT * FROM purchase WHERE MediaId = ? AND CustomerId = ?";
      let values = [`${req.query.id}`, `${req.query.customerId}`];
      
      let response = await connection.query(query, values);
      res.status(200).send({data: response.length > 0});
    } catch(e){
      res.status(500).send({ message: "Internal Server Error" });
    }
  },
  search: async function (req, res) {
    var searchTerm = req.body.searchTerm;
    const sortOption = req.body.sortOption;
    const filters = req.body.filters;
    console.log(searchTerm);
    try {
      console.log(searchTerm);
      let query =
        "SELECT * from media WHERE( title LIKE ? OR description LIKE ?) AND  isActive = 1 AND isApproved=1";

      query = applyFiltersOnQuery(query, filters);
      query = applySortOptionOnQuery(query, sortOption);

      let values = [`%${searchTerm}%`, `%${searchTerm}%`];
      let response = await connection.query(query, values);

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
  getByUserId: async function (req, res) {
    try {
      let query =
        "SELECT * from media WHERE `OwnerId` = ?";
      let response = await connection.query(query, [req.params.ownerId]);

      res.status(200).send({ data: response });
    } catch (e) {
      console.log("Error", e);
      res.status(500).send({ message: "Internal Server Error" });
    }
  },
};

module.exports = media;
