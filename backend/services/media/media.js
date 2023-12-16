var connection = require("../../utils/connection");

const media = {
  getAllMedia: async function (req, res) {
    const sortOption = req.query.sortOption;

    try {
      let query = "SELECT * from media WHERE isActive = 1 AND isApproved=1";

      switch (sortOption) {
        case 'featured':
          break;
        case 'newest':
          query += ' order by CreatedDate desc';
          break;
        case 'priceDesc':
          break;
        case 'priceAsc':
          break;
      }

      let response = await connection.query(query);
      res.status(200).send({ data: response });
    } catch (e) {
      console.log("Error", e);
      res.status(500).send({ message: "Internal Server Error" });
    }
  },
  getByID: async function (req, res) {
    try {
      let query = "SELECT * from media WHERE `Id` = ? AND isActive = 1 AND isApproved=1";
      let response = await connection.query(query,[req.params.id]);
      res.status(200).send({ data: response });
    } catch (e) {
      console.log("Error", e);
      res.status(500).send({ message: "Internal Server Error" });
    }
  },
  addMedia: async function (req, res) {
    try {
      let query =
        "insert into media(`OwnerId`,`Title`,`Description`,`MediaType`,`IsApproved`,`Price`,`IsActive`,`CreatedDate`, `FilePath`,`DemoFilePath`,`DeliveryMethod`) VALUES (?) ";
      const values = [
        req.body.OwnerId,
        req.body.Title,
        req.body.Description,
        req.body.MediaType,
        req.body.IsApproved,
        req.body.Price,
        req.body.IsActive,
        req.body.CreatedDate,
        req.body.FilePath,
        req.body.DemoFilePath,
        req.body.DeliveryMethod,
      ];
      console.log(req.body);
      let response = await connection.query(query, [values]);
      res.status(200).send({ data: response });
    } catch (e) {
      console.log("Error", e);
      res.status(500).send({ message: "Internal Server Error" });
    }
  },
  updateMedia: async function (req, res) {
    try {
      let query =
        "update media set `Title` = ?, `Description` = ?, `MediaType` = ?, `IsApproved` = ?, `Price` = ?, `IsActive` = ?, `CreatedDate` = ?, `FilePath` = ?, `DemoFilePath` = ?, `DeliveryMethod` = ? WHERE `Id` = ?";
      const values = [
        req.body.Title,
        req.body.Description,
        req.body.MediaType,
        req.body.IsApproved,
        req.body.Price,
        req.body.IsActive,
        req.body.CreatedDate,
        req.body.FilePath,
        req.body.DemoFilePath,
        req.body.DeliveryMethod,
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
      let response = await connection.query(query,[req.params.id]);
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
};

module.exports = media;
