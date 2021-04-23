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


//////////////////////////////////////
// GET COUNT FROM userCount
function select1(){
    return new Promise((resolve, reject) => {
    const sql = 'SELECT COUNT(*) FROM dating.eksempel.match';
    const request = new Request(sql, (err, rowcount) => {
        if (err) {
            reject(err)
            console.log(err)
        } else if (rowcount == 0) {
            reject({message: 'kan ikke tilgå database fra db.js: '})
        }
    });

    request.on('row', (columns) => {
        resolve(columns)

    });
    connection.execSql(request)   
    })
}
module.exports.select1 = select1;


