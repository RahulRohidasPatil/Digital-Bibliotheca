var connection = require("../../utils/connection");

const userService = {
    getById: async function(req, res) {
        try{
            let query = "SELECT * FROM user WHERE Id = ?"
            let values = [`${req.params.id}`]
            let result = await connection.query(query, values);

            res.status(200).send({data: result[0]});
        }
        catch(e){
            console.log(e)
            res.status(500).send({ message: "Internal Server Error" });
        }
    }
}

module.exports = userService;