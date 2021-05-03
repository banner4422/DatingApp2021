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

function update(payload){
    return new Promise((resolve, reject) => {
        const sql = `
        UPDATE US
            set email = @email
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
        request.addParameter('email', TYPES.VarChar, payload._email)
    
        request.on('requestCompleted', (row) => {
            console.log('User updated', row)
            resolve('user updated', row)

        });
        connection.execSql(request)
    });
}
module.exports.update = update

