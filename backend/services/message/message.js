var connection = require("../../utils/connection");
var chatService = require("../chat/chat")


const messageService = {
    create: async function(chatId, senderId, content){
        try{
            if(!content) throw 'cannot create empty message';
            
            let query = "INSERT INTO message(`SenderId`, `Content`, `ChatId`, `CreatedDate`) VALUES(?, ?, ?, CURRENT_DATE())";
            let values = [`${senderId}`, `${content}`, `${chatId}`, `${Date.now()}`]
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
            let query = "SELECT * FROM message WHERE ChatId = ?"
            let values = [`${req.params.chatId}`]
            let result = await connection.query(query, values);

            res.status(200).send({data: result});
        }
        catch(e){
            console.log(e)
            res.status(500).send({ message: "Internal Server Error" });
        }
    },
    getBySenderRecipient: async function ( req, res){
        try{
            let chatId = await chatService.getBySenderRecipient(req.query.senderId, req.query.recipientId)

            let query = "SELECT * FROM message WHERE ChatId = ?"
            let values = [`${chatId}`]
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