const {Connection, Request, TYPES} = require('tedious');
const bcrypt = require('bcrypt');
const saltRounds = 10

// our server config file
const config = require('../config.json')

// server connection
const connection = new Connection (config)

function startDb(){
    // wrapping Tedious into a promise because it isn't supported natively https://stackoverflow.com/questions/48242436/how-to-pass-a-variable-from-a-request-as-the-return-value-of-the-global-function
    return new Promise((resolve, reject) => {
        connection.on('connect', (err) => {
            if (err) {
                console.log("Connection failed")
                reject(err)
                throw err;
            } else {
                console.log("Connected")
                resolve();
            }
        })
        connection.connect();
    })
}

module.exports.sqlConnection = connection;
module.exports.startDb = startDb;

function Signup(payload){
    return new Promise((resolve, reject) => {
        // signs the user up and returns the user's id for use to log in automatically
        bcrypt.hash(payload._password, saltRounds, (err, hash) => {
            if (err) {
                console.log(err)
            }

        
        const sql = `INSERT INTO dating.eksempel.[user] (email, password, is_admin) VALUES (@email, @password, @isAdmin)
        SET IDENTITY_INSERT dating.eksempel.tinder_user ON
        INSERT INTO dating.eksempel.tinder_user (id, first_name, last_name, city, age, interest, gender, description, gender_interest, age_interest_min, age_interest_max) VALUES (scope_identity(), @first_name, @last_name, @city, @age, @interest, @gender, @description, @gender_interest, @age_interest_min, @age_interest_max)
        SET IDENTITY_INSERT dating.eksempel.tinder_user OFF
        SET IDENTITY_INSERT dating.eksempel.[user] ON
        SELECT theUser.id
        FROM eksempel.[user] AS theUser
        WHERE theUser.email = @email AND theUser.password = @password
        SET IDENTITY_INSERT dating.eksempel.[user] OFF`
        const request = new Request(sql, (err, rowCount) => {
            if (err){
                reject(err)
                console.log(err)
            }
        });

        request.addParameter('email', TYPES.VarChar, payload._email)
        request.addParameter('password', TYPES.VarChar, hash)
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
        request.addParameter('isAdmin', TYPES.Int, payload._isAdmin)

        // signup
        request.on('requestCompleted', (row) => {
            console.log('User inserted', row);
            resolve('user inserted', row)
        });

        // returns the userID
        request.on('row', (columns) => {
            resolve(columns)
        });

        connection.execSql(request)
    })

    });
}
module.exports.Signup = Signup;