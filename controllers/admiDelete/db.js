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


function removeUser(payload){
    return new Promise((resolve, reject) => {
        const sql = `
        DELETE t
        FROM dating.eksempel.tinder_user t
        JOIN dating.eksempel.[user] u
        ON t.id = u.id
        WHERE email = @email
        DELETE FROM dating.eksempel.[user] WHERE email = @email
        `;
        const request = new Request(sql, (err) => {
            if (err){
                reject(err)
                console.log(err)
            }
        });
        
        request.addParameter('email', TYPES.VarChar, payload._email)
    
        request.on('requestCompleted', (row) => {
            console.log('User deleted', row)
            resolve('user deleted', row)

        });
        connection.execSql(request)
    });
    
}
module.exports.removeUser = removeUser;