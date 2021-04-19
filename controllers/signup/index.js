const db = require('./db')
const TinderUser = require("../../model/Classes"); 

module.exports = async function (context, req) {
    context.log('the signup function was contacted');

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
            console.log("req.body test nedeunder")
            console.log(req.body)
            console.log(req.body.email)
            console.log(req.body.firstName)

            let payload = new TinderUser(req.body.email, req.body.password, req.body.firstName, req.body.lastName, req.body.city, req.body.age, req.body.interest, req.body.gender, req.body.description, req.body.genderInterest, req.body.ageInterestMin, req.body.ageInterestMax);
           
            console.log("nederunder står payload klassen")
            console.log(payload)
            console.log("navnet på payload er " + payload.name + " eller med underscore; " + payload._name)
           
            // fetch the userID created in the signup function from ./db
            let signupID = await db.Signup(payload)
            context.res = {
                body: signupID
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