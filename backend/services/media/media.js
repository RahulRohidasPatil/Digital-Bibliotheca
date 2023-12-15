var connection = require("../../utils/connection");
const firebase = require('firebase/app');
const {getStorage, ref, uploadBytes, getDownloadURL} = require('firebase/storage');
const formidable = require('express-formidable');
const fsPromises = require('fs').promises;

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
    try {
      let query = "SELECT * from media WHERE isActive = 1 AND isApproved=1";
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
    formidable()(req,res,async (err)=>{
      if(err){
        console.log(err)
      }
      try {    
        //console.log(req.files.FilePath.length,"length");
        
        var fileUrl = await uploadFile(req.files.FilePath);
        console.log(fileUrl)
        let query =
          "insert into media(`OwnerId`,`Title`,`Description`,`MediaType`,`IsApproved`,`Price`,`IsActive`,`CreatedDate`, `FilePath`,`DemoFilePath`,`DeliveryMethod`) VALUES (?) ";
        const values = [
          req.fields.OwnerId,
          req.fields.Title,
          req.fields.Description,
          req.fields.MediaType,
          parseInt(req.fields.IsApproved || 0),
          req.fields.Price,
          parseInt(req.fields.IsActive || 0),
          req.fields.CreatedDate,
          fileUrl || '',
          req.fields.DemoFilePath,
          req.fields.DeliveryMethod,
        ];
        let response = await connection.query(query, [values]);
        res.status(200).send({ data: response });
      } catch (e) {
        console.log("Error", e);
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

const uploadFile = async (file) => {
  try {
    if (!file) {
      return res.status(400).send('No file uploaded.');
    }

    const fileName = file.name;
    const fileBuffer = await fsPromises.readFile(file.path);

    const storageRef = ref(storage, `${fileName}`);
    const snapshot = await uploadBytes(storageRef, fileBuffer);

    // Get download URL
    const downloadURL= await getDownloadURL(snapshot.ref);
    return (downloadURL)

  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Internal Server Error');
  }
  

}

module.exports = media;
