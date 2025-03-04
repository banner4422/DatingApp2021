const db = require('./db');
const TinderUser = require("../../model/Classes");
const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = async function (context, req) {
    context.log('the tinderUserGetFullyByID function was contacted');

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
        default: 
            context.res = {
                body: "Please GET"
            };
            break;
    }
    context.log(`Function for tinderUserGetFullyByID has been executed successfully. UserID: ${req.query.id} got full info.`);
}

    async function get(context, req) {
        try {
            const token = req.headers.token
            let tokenConfirm;
            let is_admin;
            if (!token) {
                tokenConfirm = context.res = {
                    body: {status: 'Token does not exist, you are not authenticated'}
                }
            } else {
                jwt.verify(token, process.env.JSONSECRET, (err, decoded) => {
                    if (err) {
                        context.res = {
                            body: {status: 'Invalid token, you are not authenticated'}
                        }
                    } else {
                        tokenConfirm = decoded.userID
                        is_admin = decoded.is_admin
                    }
                })
            }
            let userID;
            if (is_admin) {
                userID = new TinderUser(req.query.id)
            } else {
                userID = new TinderUser(tokenConfirm)
            }
            let user = await db.select(userID)
            context.res = {
                body: user
            }
            context.log(`Function for tinderUserGetFullyByID has been sent successfully. UserID: ${req.query.id} got full info.`);
        } catch(error) {
             context.res = {
                 status: 400,
                 body: `No user - ${error.message}` 
             }
        }
    }
     