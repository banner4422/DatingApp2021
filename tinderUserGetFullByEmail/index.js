const db = require('./db.js');
const TinderUser = require("../model/classes.js"); 

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
        default: 
            context.res = {
                body: "please get or post"
            };
            break;
    }
}
 

    async function get(context, req) {
        try {
            let email = new TinderUser(req.body.email, req.body.password, req.body.firstName, req.body.lastName, req.body.city, req.body.age, req.body.interest, req.body.gender, req.body.description, req.body.genderInterest, req.body.ageInterestMin, req.body.ageInterestMax);
            console.log(email)
            let user = await db.select(email)
            console.log(user)
            context.res = {
                body: user
            }
        } catch(error) {
             context.res = {
                 status: 400,
                 body: `No user - ${error.message}` 
             }
        }
    }
     