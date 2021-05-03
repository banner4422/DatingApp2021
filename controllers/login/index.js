const db = require('./db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = async function (context, req) {
    context.log('the login function was contacted');

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
                body: 'You need to insert data to get login'
            };
            break
    }
    async function post(context, req){
        try{
            let payload = req.body;
            // fetch the userID created in the signup function from ./db
            let loginCheck = await db.Login(payload)
            let token;
            try {
                token = jwt.sign({userID: loginCheck[0].value, }, process.env.JSONSECRET, {expiresIn: '365 days'})
            } catch (err) {
                console.log(err)
            }
            const passMatch = await bcrypt.compare(payload.password, loginCheck[2].value)
            console.log(token)
            if (passMatch) {
                context.res = {
                    body: {loginLogic: loginCheck, token: token}
                }
                context.log('The user was logged in')
            }
        } catch(error){
            context.res = {
                status: 400,
                body: error.message
            }
            context.log('Error 400 for the login get route')
        }
    }
}