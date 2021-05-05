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
                body: 'This is a POST request route'
            };
            break
    }
    context.log('Function for emailCheck has been executed successfully');


    async function post(context, req){
        try{
           let payload = new TinderUser(0, req.body.email);
           
            let emailCheck = await db.EmailCheck(payload)
            context.res = {
                body: emailCheck
            }
        } catch(error){
            context.res = {
                status: 400,
                body: error.message
            }
            context.log('Error 400 for the emailCheck post route')
        }
    }
}