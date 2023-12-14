var connection = require("../../utils/connection");

const chatService = {
    exists: async function (senderId, recipientId) {
        try {
            let query = "SELECT COUNT(*) AS count FROM chat WHERE ( `SenderId` = ? AND `RecipientId` = ?) OR ( `SenderId` = ? AND `RecipientId` = ?)"
            const values = [`${senderId}`, `${recipientId}`, `${recipientId}`, `${senderId}`]
            let response = await connection.query(query, values);

            return response[0].count > 0 ? true : false
        }
        catch(e) {
            console.log("Error", e);
        }
    },

    create: async function (senderId, recipientId){
        try{
            if(await this.exists(senderId, recipientId)){
                this.getBySenderRecipient(senderId, recipientId)
            }
            else{
                let query = "INSERT INTO chat(`SenderId`, `RecipientId`) VALUES (?, ?)"
                const values = [`${senderId}`, `${recipientId}`]
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

    getBySenderRecipient: async function(sender, recipient){
        try {
            let query = "SELECT * FROM chat WHERE ( `SenderId` = ? AND `RecipientId` = ?) OR ( `SenderId` = ? AND `RecipientId` = ?)"
            const values = [`${sender}`, `${recipient}`, `${recipient}`, `${sender}`]
            let response = await connection.query(query, values);
            if (response.length > 0) return response[0].id;
            else throw "Chat not found";
        }
        catch(e) {
            console.log("Error", e);
        }
    },

    getUserChats: async function(req, res){
        try{
            let query = "SELECT * FROM chat WHERE `SenderId` = ? OR `RecipientId` = ?"
            const values = [`${req.params.userId}`, `${req.params.userId}`];
            let response = await connection.query(query, values);
            if (response.length > 0) res.status(200).send({data: response[0]});
            else res.status(400).send({message: "Chat not found"});
        }
        catch(e){
            console.log("Error", e);
            res.status(500).send({message: "Internal Server Error"});
        }
    }
}

module.exports = chatService