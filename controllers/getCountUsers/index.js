const db = require('./db');

module.exports = async function (context, req) {
    context.log('the getCountUsers function was contacted');

    try { 
        await db.startDb(); //start db connection
    } catch (error) {
        console.log("Error connecting to the database", error.message)
    } 
    // her håndteres der om vi enten getter eller poster på samme endpoint pga sikkerhedsmæssige årsager.
    switch (req.method) {
        case 'GET':
            await get1(context, req);
            break;
        default: 
            context.res = {
                body: "please get or post"
            };
            break;
    }
    context.log('Function for getCountUsers has been executed successfully');
}
    async function get1(context) {
        try {
            let userCount = await db.select1()
            console.log(userCount)
            context.res = {
                body: userCount
            }
        } catch(error) {
             context.res = {
                 status: 400,
                 body: `No user count - ${error.message}` 
             }
        }
    }
