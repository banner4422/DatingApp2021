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
                body: 'This is a POST route'
            };
            break
    }
    async function post(context, req){
        try{
            let payload = req.body;
            console.log(payload)
            let loginCheck = await db.Login(payload)
            let token;
            try {
                token = jwt.sign({userID: loginCheck[0].value, is_admin: loginCheck[1].value }, process.env.JSONSECRET, {expiresIn: '365 days'})
            } catch (err) {
                console.log(err)
            }
            const passMatch = await bcrypt.compare(payload.password, loginCheck[2].value)
            if (passMatch) {
                context.res = {
                    body: {
                        loginLogic: loginCheck, 
                        token: token
                    }
                }
                context.log(`UserID: ${loginCheck[0].value} was logged in.`)
            }
        } catch(error){
            context.res = {
                status: 400,
                body: error.message
            }
            context.log('Error 400 for the login POST route')
        }
    }
}