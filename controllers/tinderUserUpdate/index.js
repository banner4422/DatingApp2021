const db = require('./db.js');
const TinderUser = require("../../model/Classes"); 

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    try { 
        await db.startDb(); //start db connection
    } catch (error) {
        console.log("Error connecting to the database", error.message)
    } 
    // her håndteres der om vi enten getter eller poster på samme endpoint pga sikkerhedsmæssige årsager.
    switch (req.method) {
        case 'GET':
            await get(context, req);
            break;
        case 'POST':
            await post(context, req);
            break;
        case 'PATCH':
            await patch(context, req);
            break;
        default: 
            context.res = {
                body: "please get, post or patch"
            };
            break;
    }
}

// Patch 
async function patch(context, req) {
    try{
        //  let payload = new TinderUser(req.body.email, req.body.password, req.body.firstName, req.body.lastName, req.body.city, req.body.age, req.body.interest, req.body.gender, req.body.description, req.body.genderInterest, req.body.ageInterestMin, req.body.ageInterestMax);
        console.log(req.body)
        console.log("nedeunder står req.body.ID")
        console.log(req.body.yourID)
        let payload = new TinderUser(req.body.yourID, req.body.email, req.body.password, req.body.firstName, req.body.lastName, req.body.city, req.body.age, req.body.interest, req.body.gender, req.body.description, req.body.genderInterest, req.body.ageInterestMin, req.body.ageInterestMax );
        console.log("her står payload klassen nedeunder")
        console.log(payload)
        
        await db.update(payload)
        context.res = {
            body: {status: "update Succes"}
        }
    } catch(error) {
        context.res = {
            status: 400,
            body: error.message
        } 
    }
}
