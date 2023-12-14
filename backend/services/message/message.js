var connection = require("../../utils/connection");
var chatService = require("../chat/chat")


const messageService = {
    create: async function(chatId, senderId, content){
        try{
            if(!content) throw 'cannot create empty message';
            
            chatService.getById(chatId);

            let query = "INSERT INTO message(`SenderId`, `Content`) VALUES(?, ?, ?)";
            let values = [`${senderId}`, `${content}`]
            let result = await connection.query(query, values)

            if (result.affectedRows > 0) return true;
            else throw "failed to create chat";
        }
        catch(e){
            console.log(e)
        }
    },

    getByChatId: async function (req, res){
        try{
            let query = "SELECT * FROM chat WHERE Id = ?"
            let values = [`${req.params.chatId}`]
            let result = await connection.query(query, values);

            res.status(200).send({data: result});
        }
        catch(e){
            console.log(e)
            res.status(500).send({ message: "Internal Server Error" });
        }
    }
}

module.exports = messageService;