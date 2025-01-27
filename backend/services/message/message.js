var connection = require("../../utils/connection");
var chatService = require("../chat/chat")


const messageService = {
    create: async function(chatId, senderId, content){
        try{
            if(!content) throw 'cannot create empty message';
            
            let query = "INSERT INTO message(`SenderId`, `Content`, `ChatId`, `CreatedDate`) VALUES(?, ?, ?, CURRENT_DATE())";
            let values = [`${senderId}`, `${content}`, `${chatId}`]
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
            let chatId = await chatService.getBySenderRecipient(req.query.chatId, req.query.isDiscussion)

            let query = "SELECT msg.SenderId, msg.Content, user.FirstName AS Name, user.FamilyName AS FamilyName FROM `message` AS msg INNER JOIN user ON msg.SenderId = user.Id WHERE msg.ChatId = ?"
            let values = [`${req.query.chatId}`]
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