var connection = require("../../utils/connection");

const purchaseService = {
    getUserPurchases: async function (req, res)  {
        try{
            let query = "SELECT purchase.Id AS PurchaseId, media.Id AS MediaId, media.OwnerId AS OwnerId, media.Title AS Title, media.DeliveryMethod AS DeliveryMethod, purchase.PurchaseDate AS PurchaseDate FROM purchase INNER JOIN media ON purchase.MediaId = media.Id  WHERE purchase.CustomerId = ?"
            let values = [`${req.params.userId}`]
            let result = await connection.query(query, values);

            if(result.length > 0){
                let toReturn = await Promise.all(result.map(async (item) => {
                    let fileQuery = "SELECT file.FilePath FROM file WHERE file.MediaId = ?";
                    let fileQueryValues = [`${item.MediaId}`]

                    let filesResult = []
                    filesResult = [...(await connection.query(fileQuery, fileQueryValues))]
                    item.files = filesResult;
                    return item;
                }))

                res.status(200).send({data: toReturn});
            }

            else res.status(404).send({message: 'No purchases found for the user'});
        }
        catch(e){
            console.log(e)
            res.status(500).send({ message: "Internal Server Error" });
        }
    },
    create: async function (req, res){
        try{
            let query = "INSERT INTO purchase (CustomerId, MediaId, PurchaseDate, SellerDelivered) VALUES (?, ?, CURRENT_DATE(), 1)";
            let values = [`${req.body.customerId}`, `${req.body.mediaId}`]

            let response = await connection.query(query, values);

            if (response.affectedRows > 0) return response.insertId;
            else throw "failed to create purchase";
        }
        catch(e){
            console.log(e)
            res.status(500).send({ message: "Internal Server Error" });
        }
    }
}

module.exports = purchaseService;