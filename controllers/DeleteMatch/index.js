const db = require('./db');
const Match = require("../../model/MatchClass"); 

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    try { 
        await db.startDb(); //start db connection
    } catch (error) {
        console.log("Error connecting to the database", error.message)
    } 
    // her håndteres der om vi enten getter eller poster på samme endpoint pga sikkerhedsmæssige årsager.
    switch (req.method) {
        case 'DELETE':
            await deleteMatch(context, req);
            break;
        default: 
            context.res = {
                body: "please get, post or delete"
            };
            break;
    }
}

    // DELETE
    async function deleteMatch(context, req) {
        try{
            let payload = new Match ( req.query.yourID, req.query.theirID);
            console.log(payload)
            await db.removeMatch(payload)
            context.res = {
                body: {status: "Delete Succes"}
            }
        } catch(error) {
            context.res = {
                status: 400,
                body: error.message
            } 
        }
    }

