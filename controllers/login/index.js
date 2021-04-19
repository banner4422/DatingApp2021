const db = require('./db')

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
            let loginID = await db.Login(payload)
            context.res = {
                body: loginID
            }
            context.log('The user was logged in')
        } catch(error){
            context.res = {
                status: 400,
                body: error.message
            }
            context.log('Error 400 for the login get route')
        }
    }
}