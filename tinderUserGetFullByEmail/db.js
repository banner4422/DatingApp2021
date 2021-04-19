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

function select(email){
    return new Promise((resolve, reject) => {
    const sql = `
    SELECT *
    FROM dating.eksempel.tinder_user
    INNER JOIN dating.eksempel.[user]
    ON dating.eksempel.tinder_user.id = dating.eksempel.[user].id
    WHERE email = @email
    `;
    const request = new Request(sql, (err, rowcount) => {
        if (err) {
            reject(err)
            console.log(err)
        } else if (rowcount == 0) {
            reject({message: 'User does not exist:'})
        }
    });
    request.addParameter('email', TYPES.VarChar, email._email)

    request.on('row', (columns) => {
        resolve(columns)
    });
    connection.execSql(request)   
    })
}
module.exports.select = select;
