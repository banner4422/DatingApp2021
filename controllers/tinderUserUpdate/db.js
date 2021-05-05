const { Connection, Request, TYPES} = require('tedious');
const config = require('../config.json')
var connection = new Connection(config);

function startDb(){
    return new Promise((resolve, reject) => {
        connection.on('connect', (err) => {
            if (err) {
                console.log("connection failed")
                reject(err)
                throw err;
            }
            else {
                console.log("Connected")
                resolve();
            }
        })
        connection.connect();
    })
};
module.exports.sqlConnection = connection;
module.exports.startDb = startDb

function update(payload){
    return new Promise((resolve, reject) => {
        const sql = `
        UPDATE TU
            set first_name = @first_name,
                last_name = @last_name,
                city = @city,
                age = @age,
                interest = @interest, 
                gender = @gender, 
                description = @description, 
                gender_interest = @gender_interest, 
                age_interest_min = @age_interest_min, 
                age_interest_max = @age_interest_max
        from dating.eksempel.tinder_user as TU
            join dating.eksempel.[user] as US
            ON TU.id = US.id
        WHERE TU.id = @yourID
        `;

        const request = new Request(sql, (err) => {
            if (err){
                reject(err)
                console.log(err)
            }
        });
        
        request.addParameter('yourID', TYPES.Int, payload._id)
        request.addParameter('first_name', TYPES.Text, payload._firstName)
        request.addParameter('last_name', TYPES.Text, payload._lastName)
        request.addParameter('city', TYPES.Text, payload._city)
        request.addParameter('age', TYPES.Int, payload._age)
        request.addParameter('interest', TYPES.Int, payload._interest)
        request.addParameter('gender', TYPES.Int, payload._gender)
        request.addParameter('description', TYPES.Text, payload._description)
        request.addParameter('gender_interest', TYPES.Int, payload._genderInterest)
        request.addParameter('age_interest_min', TYPES.Int, payload._ageMin)
        request.addParameter('age_interest_max', TYPES.Int, payload._ageMax)
    
        request.on('requestCompleted', (row) => {
            console.log('User updated', row)
            resolve('user updated', row)

        });
        connection.execSql(request)
    });
}
module.exports.update = update

