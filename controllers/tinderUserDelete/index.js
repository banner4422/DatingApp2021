const db = require('./db');
const TinderUser = require("../../model/Classes"); 

module.exports = async function (context, req) {
    context.log('the tinderUserDelete function was contacted');

    try { 
        await db.startDb(); //start db connection
    } catch (error) {
        console.log("Error connecting to the database", error.message)
    } 
    // her håndteres der om vi enten getter eller poster på samme endpoint pga sikkerhedsmæssige årsager.
    switch (req.method) {
        case 'DELETE':
            await deleteUser(context, req);
            break;
        default: 
            context.res = {
                body: "Please DELETE"
            };
            break;
    }
    context.log(`Function for tinderUserDelete has been executed successfully`);
}

    // DELETE
    async function deleteUser(context, req) {
        try{
            let payload = new TinderUser(req.query.userID);
            await db.removeUser(payload)
            context.res = {
                body: {status: `UserID: ${req.query.userID} was successfully deleted`}
            }
            context.log(`Function for tinderUserDelete has been executed successfully. UserID: ${req.query.userID} got deleted.`);
        } catch(error) {
            context.res = {
                status: 400,
                body: error.message
            } 
        }
    }

