const db = require('./db')
const Dislike = require("../../model/dislikeClass"); 

module.exports = async function (context, req) {
    context.log('the dislike function was contacted');

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
    context.log('Function for dislike has been executed successfully');

    async function post(context, req){
        try{
           let payload = new Dislike(req.body.id1, req.body.id2);
                    
            await db.DislikeFunction(payload)
            context.res = {
                body: {status: `Dislike by userID: ${payload._id2} to userID: ${payload._id1} was successful`}
            }
        } catch(error){
            context.res = {
                status: 400,
                body: error.message
            }
            context.log('Error 400 for the delete POST route')
        }
    }
}