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
    },
    editProfile: async function (req, res) {
        try {
            const { userId, firstName, familyName, phoneNumber } = req.body;
            const query = "UPDATE user SET FirstName = ?, FamilyName = ?, PhoneNumber = ? WHERE Id = ?"
            const values = [firstName, familyName, phoneNumber, userId]
            let result = await connection.query(query, values)

            res.status(200).send({ data: result.affectedRows })
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: "Internal Server Error" });
        }
    }
}

module.exports = userService;