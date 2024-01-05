var connection = require("../../utils/connection");

const adminService = {
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
}

module.exports = adminService;