const db = require('./db.js');
const TinderUser = require("../../model/Classes"); 

module.exports = async function (context, req) {
    context.log('the tinderUserUpdateEmail function was contacted');

    try { 
        await db.startDb(); //start db connection
    } catch (error) {
        console.log("Error connecting to the database", error.message)
    } 
    // her håndteres der om vi enten getter eller poster på samme endpoint pga sikkerhedsmæssige årsager.
    switch (req.method) {
        case 'PATCH':
            await patch(context, req);
            break;
        default: 
            context.res = {
                body: "please get, post or patch"
            };
            break;
    }
    context.log(`Function for tinderUserUpdateEmail has been executed successfully. UserID: ${req.query.userID} got their email updated.`);
}

// Patch 
async function patch(context, req) {
    try{
        
        let payload = new TinderUser(req.body.userID, req.body.email, req.body.password, req.body.firstName, req.body.lastName, req.body.city, req.body.age, req.body.interest, req.body.gender, req.body.description, req.body.genderInterest, req.body.ageInterestMin, req.body.ageInterestMax );
        
        await db.update(payload)
        context.res = {
            body: {status: `The user email for UserID: ${req.body.userID} was successfully updated`}
        }
        context.log(`Function for tinderUserUpdateEmail has been sent successfully. UserID: ${req.query.userID} got their email updated.`);
    } catch(error) {
        context.res = {
            status: 400,
            body: error.message
        } 
    }
}
