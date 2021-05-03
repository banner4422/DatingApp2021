const db = require('./db')
const Like = require("../../model/likeClass"); 

module.exports = async function (context, req) {
    context.log('the like function was contacted');

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

           let payload = new Like(req.body.id1, req.body.id2);
           //let payload = req.query

            console.log("nederunder står payload klassen")
            console.log(payload)
                       
            // fetch the userID created in the signup function from ./db
            const like = await db.LikeFunction(payload)
            context.res = {
                body: like
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