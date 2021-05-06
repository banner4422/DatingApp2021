const db = require('./db');
const Match = require("../../model/MatchClass"); 

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function for DeleteMatch processed a request.');

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
                body: "Please DELETE"
            };
            break;
    }
    context.log('Function for DeleteMatch has been executed successfully');
}

    // DELETE
    async function deleteMatch(context, req) {
        try{
            let payload = new Match ( req.query.yourID, req.query.theirID);
            console.log(payload)
            await db.removeMatch(payload)
            context.res = {
                body: { status: `Delete match for userID: ${payload._id1} with userID: ${payload._id1} was successful` }
            }
            context.log(`Delete match for userID: ${payload._id1} with userID: ${payload._id1} was successful`);
        } catch(error) {
            context.res = {
                status: 400,
                body: error.message
            } 
        }
    }

