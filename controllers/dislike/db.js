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

function DislikeFunction(payload){
    console.log(payload)
    return new Promise((resolve, reject) => {
        // signs the user up and returns the user's id for use to log in automatically
        const sql = `INSERT INTO dating.eksempel.disliked (user_id_reciever, user_id_sender) VALUES (@id1, @id2)`
        const request = new Request(sql, (err) => {
            if (err){
                reject(err)
                console.log(err)
            }
        });

        request.addParameter('id1', TYPES.int, payload._id1)
        request.addParameter('id2', TYPES.int, payload._id2)

        // signup
        request.on('requestCompleted', (row) => {
            console.log('Dislike inserted', row);
            resolve('Dislike inserted', row)
        });

        request.on('row', (columns) => {
            resolve(columns)
        });

        connection.execSql(request)

    });
}
module.exports.DislikeFunction = DislikeFunction;