const {Connection, Request, TYPES} = require('tedious')

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

function Login(payload){
    return new Promise((resolve, reject) => {
        // signs the user up and returns the user's id for use to log in automatically
        const sql = `
        SET IDENTITY_INSERT dating.eksempel.[user] ON
        SELECT theUser.id, theUser.is_admin, theUser.password
        FROM eksempel.[user] AS theUser
        WHERE theUser.email = @email
        SET IDENTITY_INSERT dating.eksempel.[user] OFF`
        const request = new Request(sql, (err, rowCount) => {
            if (err){
                reject(err)
                console.log(err)
            } else if (rowCount == 0) {
                reject({message: 'User does not exist'})
            } else if (rowCount > 1) {
                reject({message: '2 user with the same email or '})
            }
        });
        request.addParameter('email', TYPES.VarChar, payload.email)

        // returns the userID
        request.on('row', (columns) => {
            resolve(columns)
        });

        connection.execSql(request)

    });
}
module.exports.Login = Login;