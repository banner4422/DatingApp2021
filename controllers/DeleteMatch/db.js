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


function removeMatch(payload){
    return new Promise((resolve, reject) => {
        const sql = `
        DELETE
        FROM dating.eksempel.match
        WHERE user_id_1 = @yourID AND user_id_2 = @theirID
        OR
        user_id_1 = @theirID  AND user_id_2 = @yourID
        `;
        const request = new Request(sql, (err) => {
            if (err){
                reject(err)
                console.log(err)
            }
        });
        
        request.addParameter('yourID', TYPES.VarChar, payload._id1)
        request.addParameter('theirID', TYPES.VarChar, payload._id2)
    
        request.on('requestCompleted', (row) => {
            console.log('Match deleted', row)
            resolve('match deleted', row)

        });
        connection.execSql(request)
    });
    
}
module.exports.removeMatch = removeMatch;