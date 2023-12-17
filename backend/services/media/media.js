var connection = require("../../utils/connection");
const firebase = require('firebase/app');
const {getStorage, ref, uploadBytes, getDownloadURL} = require('firebase/storage');
const formidable = require('express-formidable');
const { randomUUID } = require("crypto");
const fsPromises = require('fs').promises;
const { applyFiltersOnQuery, applySortOptionOnQuery } = require("../../utils/utils");

const firebaseConfig = {
  apiKey: "AIzaSyAWBoNN0YjVQf8hSNPp5OATbb_L3vEDLLk",
  authDomain: "gdsd-6c209.firebaseapp.com",
  projectId: "gdsd-6c209",
  storageBucket: "gdsd-6c209.appspot.com",
  messagingSenderId: "953421522259",
  appId: "1:953421522259:web:b4e9334f053585698bada6"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const storage = getStorage(firebaseApp)

const media = {
  getAllMedia: async function (req, res) {
    const sortOption = req.query.sortOption;
    const filters = JSON.parse(req.query.filters);

    try {
      let query = "SELECT * from media WHERE isActive = 1 AND isApproved=1";

      query = applyFiltersOnQuery(query, filters);
      query = applySortOptionOnQuery(query, sortOption);

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
    formidable({multiples:true})(req,res,async (err)=>{
      if(err){
        console.log(err)
        res.status(500).send({ message: "Internal Server Error" });
      }
      let insertId = null;
      try {    
        //console.log(req.files.FilePath.length,"length");
        
        //var fileUrl = await 
        let query =
          "insert into media(`OwnerId`,`Title`,`Description`,`MediaType`,`IsApproved`,`Price`,`IsActive`,`CreatedDate`,`DemoFilePath`,`DeliveryMethod`) VALUES (?) ";
        const values = [
          req.user.Id,
          req.fields.Title,
          req.fields.Description,
          req.fields.MediaType,
          parseInt(req.fields.IsApproved || 0),
          req.fields.Price,
          parseInt(req.fields.IsActive || 0),
          req.fields.CreatedDate,
          
          req.fields.DemoFilePath,
          req.fields.DeliveryMethod,
        ];
        let response = await connection.query(query, [values]);
        insertId = response.insertId
        if (!Array.isArray(req.files.Files)) req.files.Files = [req.files.Files];
        let downloadUrls = await uploadFile(req.files.Files,insertId);
        console.log(downloadUrls)
        res.status(200).send({ data: response });
      } catch (e) {
        console.log("Error", e);
        //Incase the media gets added but the upload files function throws an error the below query removes the empty media entry
        if(insertId){
          "DELETE FROM media WHERE Id = insertId";
        }
        res.status(500).send({ message: "Internal Server Error" });
      }
    })
    
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
      res.status(200).send({ data: response });
    } catch (e) {
      console.log("Error", e);
      res.status(500).send({ message: "Internal Server Error" });
    }
  },

};

const uploadFile = async (files,mediaId) => {
  try {
    if (!files) {
      return console.error('No file uploaded.');
    }
    const uploadPromises = files.map(async (file)=>{
      const fileName = `${randomUUID()}_${file.name}`;
      const fileBuffer= await fsPromises.readFile(file.path);

      const storageRef = ref(storage, `${fileName}`);
      const snapshot = await uploadBytes(storageRef, fileBuffer);

      const downloadURL= await getDownloadURL(snapshot.ref);
      let query = 'INSERT INTO file (MediaId, FilePath, IsDemo) VALUES (?, ?, ?)';
      const values = [
      mediaId,
      downloadURL,
      false
    ]
      await connection.query(query, values);
      return downloadURL;
    });
    const downloadURLs = await Promise.all(uploadPromises);
    return downloadURLs;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw (error)
  }
}

module.exports = media;
