const db = require('./db')
const TinderUser = require("../../model/Classes");
const jwt = require('jsonwebtoken')
require('dotenv').config()

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
                body: 'This is a POST request route'
            };
            break
    }
    async function post(context, req){
        try{
           let payload = new TinderUser(0, req.body.email, req.body.password, req.body.firstName, req.body.lastName, req.body.city, req.body.age, req.body.interest, req.body.gender, req.body.description, req.body.genderInterest, req.body.ageInterestMin, req.body.ageInterestMax);
           
            let signupID = await db.Signup(payload)

            let token;
            try {
                token = jwt.sign({userID: signupID[0].value, }, process.env.JSONSECRET, {expiresIn: '365 days'})
            } catch (err) {
                console.log(err)
            }

            context.res = {
                body: {loginLogic: signupID, token: token}
            }
            context.log(`UserID: ${signupID[0].value} was signed up and logged in.`)
        } catch(error){
            context.res = {
                status: 400,
                body: error.message
            }
            context.log('Error 400 for the signup POST route')
        }
    }
}