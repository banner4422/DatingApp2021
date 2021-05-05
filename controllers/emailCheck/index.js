const db = require('./db')
const TinderUser = require("../../model/Classes"); 

module.exports = async function (context, req) {
    context.log('the email check was contacted');

    try {
        await db.startDb(); //start db connection
    } catch (error) {
        console.log("Error connecting to the database", error.message)
    }
    switch (req.method) {
        case 'POST':
            await post(context, req);
            break
        default:
            context.res = {
                body: 'This is a post request route'
            };
            break
    }
    async function post(context, req){
        try{
            

           // let payload = new TinderUser(req.body.email, req.body.password, req.body.firstName, req.body.lastName, req.body.city, req.body.age, req.body.interest, req.body.gender, req.body.description, req.body.genderInterest, req.body.ageInterestMin, req.body.ageInterestMax);
           let payload = new TinderUser(0, req.body.email);
           
            // fetch the userID created in the signup function from ./db
            let emailCheck = await db.EmailCheck(payload)
            context.res = {
                body: emailCheck
            }
            context.log('The user was signed up and logged in')
        } catch(error){
            context.res = {
                status: 400,
                body: error.message
            }
            context.log('Error 400 for the signup post route')
        }
    }
}