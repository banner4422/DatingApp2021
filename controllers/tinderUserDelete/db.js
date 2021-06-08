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
        DELETE ls
        FROM dating.eksempel.liked as ls
        WHERE
              user_id_reciever = @userID
            OR
              user_id_sender = @userID
        
        
        DELETE dls
            FROM dating.eksempel.disliked as dls
            WHERE
                user_id_reciever = @userID
                OR
                user_id_sender = @userID
        
        DELETE m
            FROM dating.eksempel.match as m
            WHERE
                user_id_1 = @userID
                OR
                user_id_2 = @userID
        
        DELETE t
                FROM dating.eksempel.tinder_user t
                JOIN dating.eksempel.[user] u
                ON t.id = u.id
                WHERE t.id = @userID
                DELETE FROM dating.eksempel.[user] WHERE id = @userID
        `;
        const request = new Request(sql, (err) => {
            if (err){
                reject(err)
                console.log(err)
            }
        });
        
        request.addParameter('userID', TYPES.VarChar, payload._id)
    
        request.on('requestCompleted', (row) => {
            console.log('User deleted', row)
            resolve('user deleted', row)

        });
        connection.execSql(request)
    });
    
}
module.exports.removeUser = removeUser;