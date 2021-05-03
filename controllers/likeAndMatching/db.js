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

function LikeFunction(payload){
    return new Promise((resolve, reject) => {
        // signs the user up and returns the user's id for use to log in automatically
        const sql = `INSERT INTO dating.eksempel.liked (user_id_reciever, user_id_sender) VALUES (@id1, @id2)
        SET IDENTITY_INSERT dating.eksempel.liked ON
        SELECT *
        FROM dating.eksempel.liked AS liking
        WHERE (liking.user_id_sender = @id1 AND liking.user_id_reciever = @id2) OR (liking.user_id_sender = @id2 AND liking.user_id_reciever = @id1)
        FOR JSON PATH
        SET IDENTITY_INSERT dating.eksempel.liked OFF`
        const request = new Request(sql, function (err) {
            if (err){
                reject(err)
                console.log(err)
            }
        });

        request.addParameter('id1', TYPES.Int, payload._id1)
        request.addParameter('id2', TYPES.Int, payload._id2)

        // signup
        request.on('requestCompleted', (row) => {
            console.log('Like inserted', row);
            resolve('Like inserted', row)
        });

        request.on('row', (columns) => {
            resolve(JSON.stringify(columns))
        });

        connection.execSql(request)

    });
}
module.exports.LikeFunction = LikeFunction;