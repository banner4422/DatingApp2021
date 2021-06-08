const { Connection, Request, TYPES} = require('tedious');
const config = require('../config.json')
const bcrypt = require('bcrypt');
const saltRounds = 10
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

function update(payload){
    return new Promise((resolve, reject) => {
        bcrypt.hash(payload._password, saltRounds, (err, hash) => {
            if (err) {
                console.log(err)
            }
        const sql = `
        UPDATE US
            set password = @password
        from dating.eksempel.[user] as US
        WHERE id = @yourID
        `;

        const request = new Request(sql, (err) => {
            if (err){
                reject(err)
                console.log(err)
            }
        });
        
        request.addParameter('yourID', TYPES.Int, payload._id)
        request.addParameter('password', TYPES.VarChar, hash)
    
        request.on('requestCompleted', (row) => {
            console.log('User updated', row)
            resolve('user updated', row)

        });
        connection.execSql(request)
    })
    });
}
module.exports.update = update

