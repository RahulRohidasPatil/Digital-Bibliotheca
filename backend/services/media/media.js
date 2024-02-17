var connection = require("../../utils/connection");
const formidable = require("express-formidable");
const axios = require("axios");
const fs = require("fs");
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient({keyFilename:'services/media/braided-circuit-412812-0eee33305eeb.json'});

const {
  applyFiltersOnQuery,
  applySortOptionOnQuery,
} = require("../../utils/utils");

const fileService = require("../file/file");

const media = {
  getAllMedia: async function (req, res) {
    const sortOption = req.query.sortOption;
    const userId = req.headers.userid;
    try {
      let query =
        "SELECT * from media m WHERE isActive = 1 AND isApproved=1 AND isReported = 0 AND m.Id NOT IN (SELECT MediaID from reportedmedia WHERE ReportedBy = ?) ";

      if (req.query.filters) {
        const filters = JSON.parse(req.query.filters);
        query = applyFiltersOnQuery(query, filters);
      }
      query = applySortOptionOnQuery(query, sortOption);
      console.log(query);
      let response = await connection.query(query, [userId]);

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
      let query = "SELECT * from media WHERE `Id` = ? ";
      let response = await connection.query(query, [req.params.id]);

      let demoFilePathObj = await fileService.getDemoFile(req.params.id);
      if (demoFilePathObj && Object.keys(demoFilePathObj).length > 0) {
        response[0].DemoFilePath = demoFilePathObj.FilePath;
      } else {
        response[0].DemoFilePath = null;
      }

      const commentsResponse = await connection.query(
        "select * from comment where MediaId=?",
        [req.params.id]
      );
      response[0].comments = commentsResponse;

      const averageStarsResponse = await connection.query("SELECT AVG(stars) as averageStars FROM comment WHERE MediaId = ?", [req.params.id])
      response[0].averageStars = Math.round(averageStarsResponse[0].averageStars)

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
        let now = new Date();
        let query =
          "insert into media(`OwnerId`,`Title`,`Description`,`MediaType`,`IsApproved`,`Price`,`IsActive`,`CreatedDate`,`DemoFilePath`,`DeliveryMethod`, `IsReported`) VALUES (?) ";
        const values = [
          req.user.Id,
          req.fields.Title,
          req.fields.Description,
          req.fields.MediaType,
          req.fields.IsApproved,
          req.fields.Price,
          parseInt(req.fields.IsActive || 0),
          now.toISOString().split("T")[0],

          req.fields.DemoFilePath,
          req.fields.DeliveryMethod,
          req.fields.IsReported,
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
  isOwner: async function (req, res) {
    try {
      let query = "SELECT * FROM media WHERE Id = ? AND OwnerId = ?";
      let values = [`${req.query.id}`, `${req.query.ownerId}`];
      let response = await connection.query(query, values);

      res.status(200).send({ data: response.length > 0 });
    } catch (e) {
      res.status(500).send({ message: "Internal Server Error" });
    }
  },
  purchased: async function (req, res) {
    try {
      let query = "SELECT * FROM purchase WHERE MediaId = ? AND CustomerId = ?";
      let values = [`${req.query.id}`, `${req.query.customerId}`];

      let response = await connection.query(query, values);
      res.status(200).send({ data: response.length > 0 });
    } catch (e) {
      res.status(500).send({ message: "Internal Server Error" });
    }
  },
  search: async function (req, res) {
    var searchTerm = req.body.searchTerm;
    const sortOption = req.body.sortOption;
    const filters = req.body.filters;
    let userId = req.headers.userid;
    console.log(searchTerm);
    try {
      console.log(searchTerm);
      let query =
        "SELECT * from media m  WHERE( title LIKE ? OR description LIKE ?) AND  isActive = 1 AND isApproved=1 AND isReported = 0 AND m.Id NOT IN (SELECT MediaID from reportedmedia WHERE ReportedBy = ?) ";

      query = applyFiltersOnQuery(query, filters);
      query = applySortOptionOnQuery(query, sortOption);

      console.log(query);
      let values = [`%${searchTerm}%`, `%${searchTerm}%`, userId];
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
      let query = "SELECT * from media WHERE `OwnerId` = ?";
      let response = await connection.query(query, [req.params.ownerId]);

      res.status(200).send({ data: response });
    } catch (e) {
      console.log("Error", e);
      res.status(500).send({ message: "Internal Server Error" });
    }
  },
  reportMedia: async (req, res) => {
    try {
      // Extract data from the request
      const { MediaId, ReportedBy, ReasonOfReporting } = req.body;
      console.log(req.body, req.body, MediaId, ReportedBy, ReasonOfReporting);
      // Insert into reportedmedia table
      const query =
        "INSERT INTO reportedmedia (MediaID, ReportedBy, ReasonOfReporting) VALUES (?, ?, ?)";
      const values = [MediaId, ReportedBy, ReasonOfReporting];
      const response = await connection.query(query, values);

      res
        .status(200)
        .send({ message: "Report added successfully.", data: response });
    } catch (error) {
      console.log("Error", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  },
  addComment: async function (req, res) {
    const { customerId, mediaId, stars, comment } = req.body
    try {
      if (!customerId || !mediaId || !stars || !comment) throw new Error("customerId, mediaId, sars, comment cannot be empty")

      const query="insert into comment(CustomerId,MediaId,stars,CommentText,CreatedDate)values(?,?,?,?,?)"
      await connection.query(query, [customerId, mediaId, stars, comment, new Date()]);
      res.status(200).send({ message: "Comment Added Successfully" })
    } catch (error) {
      console.log("Error Adding Comment", error.message);
      res.status(500).send({ message: "Internal Server Error" });
    }
  },

  generateTags: async function (req, res) {
    formidable({ multiples: true })(req, res, async (err) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: "Internal Server Error" });
      }
      try {
        
        // Calling Google Vision API

        const imageFile = req.files.Files;

        // Read the image file as binary data
        const imageBuffer = fs.readFileSync(imageFile.path);
        // Convert binary data to base64
        const base64Image = imageBuffer.toString("base64");

        // Make the POST request
        const [result] = await client.labelDetection(
          {
            image: { content: base64Image },
          }
        );
        
          let tags = []

        if(result?.labelAnnotations?.length){
          for(const label of result?.labelAnnotations){
            tags.push(label.description)
          }
        }
        res
            .status(200)
            .send({ message: "Tags Generated Successful", tags: tags });
       
      } catch (e) {
        console.log("Error", e);
        res.status(500).send({ message: "Internal Server Error" });
      }
    });
  },
};

module.exports = media;
