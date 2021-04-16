const db = require('./db')

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
            let payload = req.body;
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
    /*
    const email = (req.query.email || (req.body && req.body.email))
    const password = (req.query.password || (req.body && req.body.password))
    const firstName = (req.query.firstName || (req.body && req.body.firstName))
    const lastName = (req.query.lastName || (req.body && req.body.lastName))
    const city = (req.query.city || (req.body && req.body.city))
    const age = (req.query.age || (req.body && req.body.age))
    const interest = (req.query.interest || (req.body && req.body.interest))
    const gender = (req.query.gender || (req.body && req.body.gender))
    const description = (req.query.description || (req.body && req.body.description))
    const genderInterest = (req.query.genderInterest || (req.body && req.body.genderInterest))
    const ageInterestMin = (req.query.ageInterestMin || (req.body && req.body.ageInterestMin))
    const ageInterestMax = (req.query.ageInterestMax || (req.body && req.body.ageInterestMax))

    executeSQL(context, email, password, firstName, lastName, city, age, interest, gender, description, genderInterest, ageInterestMin, ageInterestMax)
    
}
*/