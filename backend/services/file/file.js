var connection = require("../../utils/connection");
const { randomUUID } = require("crypto");
const fsPromises = require("fs").promises;
const firebase = require("firebase/app");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");
const firebaseConfig = {
  apiKey: "AIzaSyAWBoNN0YjVQf8hSNPp5OATbb_L3vEDLLk",
  authDomain: "gdsd-6c209.firebaseapp.com",
  projectId: "gdsd-6c209",
  storageBucket: "gdsd-6c209.appspot.com",
  messagingSenderId: "953421522259",
  appId: "1:953421522259:web:b4e9334f053585698bada6",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const storage = getStorage(firebaseApp);

const fileService = {
  uploadFile: async (files, mediaId, isDemo = false) => {
    try {
      if (!files) {
        return console.error("No file uploaded.");
      }
      const uploadPromises = files.map(async (file) => {
        const fileName = `${randomUUID()}_${file?.name}`;
        const fileBuffer = await fsPromises.readFile(file.path);

        const storageRef = ref(storage, `${fileName}`);
        const snapshot = await uploadBytes(storageRef, fileBuffer);

        const downloadURL = await getDownloadURL(snapshot.ref);
        let query =
          "INSERT INTO file (MediaId, FilePath, IsDemo) VALUES (?, ?, ?)";
        const values = [mediaId, downloadURL, isDemo];
        await connection.query(query, values);
        return downloadURL;
      });
      const downloadURLs = await Promise.all(uploadPromises);
      return downloadURLs;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  },
  getDemoFile: async (mediaId) => {
    try {
      let query = "SELECT FilePath from file where MediaId = ? AND IsDemo = 1";
      let values = [`${mediaId}`];

      let result = await connection.query(query, values);
      return result[0];
    } catch (e) {
      console.log(e);
    }
  },
};

module.exports = fileService;
