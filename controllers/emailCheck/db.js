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

function EmailCheck(payload){
    return new Promise((resolve, reject) => {
        // signs the user up and returns the user's id for use to log in automatically
        const sql = `SELECT [user].email
        FROM dating.eksempel.[user]
        WHERE email = @email`
        const request = new Request(sql, (err, rowcount) => {
            if (err){
                reject(err)
                console.log(err)
            }
        });

        request.addParameter('email', TYPES.VarChar, payload._email)

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

    });
}
module.exports.EmailCheck = EmailCheck;