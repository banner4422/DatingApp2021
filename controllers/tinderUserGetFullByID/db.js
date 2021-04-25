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

function select(userID){
    return new Promise((resolve, reject) => {
    const sql = `
    SELECT *
    FROM dating.eksempel.tinder_user AS tinder
    INNER JOIN dating.eksempel.[user] AS theUser
    ON tinder.id = theUser.id
    WHERE tinder.id = @id
    `;
    const request = new Request(sql, (err, rowcount) => {
        if (err) {
            reject(err)
            console.log(err)
        } else if (rowcount == 0) {
            reject({message: 'User does not exist:'})
        }
    });
    request.addParameter('id', TYPES.VarChar, userID._id)

    request.on('row', (columns) => {
        resolve(columns)
    });
    connection.execSql(request)   
    })
}
module.exports.select = select;
