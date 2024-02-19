var connection = require("../../utils/connection");

const chatService = {
    exists: async function (senderId, recipientId, isDiscussion = false) {
        try {
            let query = "SELECT COUNT(*) AS count FROM chat WHERE ( `SenderId` = ? AND `RecipientId` = ?) OR ( `SenderId` = ? AND `RecipientId` = ?) AND `IsGroupChat` = ?"
            const values = [`${senderId}`, `${recipientId}`, `${recipientId}`, `${senderId}`, `${isDiscussion}`]
            let response = await connection.query(query, values);

            return response[0].count > 0 ? true : false
        }
        catch(e) {
            console.log("Error", e);
        }
    },
    discussionExists: async function (recipientId, isDiscussion = false) {
        try {
            let query = "SELECT COUNT(*) AS count FROM chat WHERE `RecipientId` = ? AND `IsGroupChat` = ?"
            const values = [`${recipientId}`, `${isDiscussion}`]
            let response = await connection.query(query, values);

            return response[0].count > 0 ? true : false
        }
        catch(e) {
            console.log("Error", e);
        }
    },
    create: async function (senderId, recipientId, isDiscussion = false){
        try{
            if(await this.exists(senderId, recipientId, isDiscussion)){
                this.getBySenderRecipient(senderId, recipientId)
            }
            else{
                let query = "INSERT INTO chat(`SenderId`, `RecipientId`, `IsGroupChat`) VALUES (?, ?, b?)"
                const values = [`${senderId}`, `${recipientId}`, `${isDiscussion}`]
                let response = await connection.query(query, values)
                if(response.affectedRows > 0){
                    //get chatId
                    return this.getBySenderRecipient(senderId, recipientId)
                }
                else throw "Failed to initialize chat";
            }
        }
        catch(e){
            console.log("Error", e);
        }
    },

    getBySenderRecipient: async function(sender, recipient, isDiscussion = 0){
        try {
            let query = "SELECT * FROM chat WHERE ( `SenderId` = ? AND `RecipientId` = ?) OR ( `SenderId` = ? AND `RecipientId` = ?) AND `IsGroupChat` = b?"
            const values = [`${sender}`, `${recipient}`, `${recipient}`, `${sender}`, `${isDiscussion}`]
            let response = await connection.query(query, values);
            if (response.length > 0) return response[0].Id;
            else throw "Chat not found";
        }
        catch(e) {
            console.log("Error", e);
        }
    },
    getDiscussionByMediaId: async function(mediaId, isDiscussion = 0){
        try {
            let query = "SELECT * FROM chat WHERE `RecipientId` = ? AND `IsGroupChat` = b?"
            const values = [`${mediaId}`, `${isDiscussion}`]
            let response = await connection.query(query, values);
            if (response.length > 0) return response[0].Id;
            else throw "Chat not found";
        }
        catch(e) {
            console.log("Error", e);
        }
    },
    getUserChats: async function(req, res){
        try{
            let query = "SELECT chat.Id as `ChatId`, chat.IsGroupChat AS `IsGroupChat`, user.Id as `UserId`, user.FirstName, user.FamilyName FROM chat INNER JOIN user ON (chat.SenderId = user.Id OR chat.RecipientId = user.Id) WHERE (chat.SenderId = ? OR chat.RecipientId = ?) AND chat.IsGroupChat = b'0'";
            const values = [`${req.params.userId}`, `${req.params.userId}`];
            let response = await connection.query(query, values);
            let groupChatQuery = "SELECT DISTINCT chat.Id as `ChatId`, chat.IsGroupChat AS `IsGroupChat`, media.Id as `MediaId`, media.Title FROM chat INNER JOIN media ON chat.RecipientId = media.Id INNER JOIN message ON chat.Id = message.ChatId WHERE chat.SenderId = ? OR message.SenderId = ?";
            let groupChatQueryValues = [`${req.params.userId}`,`${req.params.userId}`];
            let groupChatResponse = await connection.query(groupChatQuery, groupChatQueryValues);
            if (response.length > 0 || groupChatResponse.length > 0) {
                    res.status(200).send({data: [...response.filter((item) => item.UserId != req.params.userId), ...groupChatResponse]});
            }
            
            else res.status(400).send({message: "Chat not found"});
        }
        catch(e){
            console.log("Error", e);
            res.status(500).send({message: "Internal Server Error"});
        }
    }
}

module.exports = chatService