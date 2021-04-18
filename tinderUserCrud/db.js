const { Connection, Request, TYPES} = require('tedious');
const config = require('./config.json')
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

function insert(payload){
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO [pd2Users].[users] (name, email, gender, country, birthdate) VALUES (@name, @email, @gender, @country, @birthdate)`;
        const request = new Request(sql, (err) => {
            if (err){
                reject(err)
                console.log(err)
            }
        });

        request.addParameter('name', TYPES.VarChar, payload._name)
        request.addParameter('email', TYPES.VarChar, payload._email)
        request.addParameter('gender', TYPES.VarChar, payload._gender)
        request.addParameter('country', TYPES.VarChar, payload._country)
        request.addParameter('birthdate', TYPES.Date, payload._birthdate)
        

        request.on('requestCompleted', (row) => {
            console.log('User inserted', row)
            resolve('user inserted', row)

        });
        connection.execSql(request)
    });
    
}
module.exports.insert = insert

//40:40 i pd2 videoen
function select(name){
    return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM [pd2Users].[users] where name = @name';
    const request = new Request(sql, (err, rowcount) => {
        if (err) {
            reject(err)
            console.log(err)
        } else if (rowcount == 0) {
            reject({message: 'User does not exist:'})
        }
    });
    request.addParameter('name', TYPES.VarChar, name._name)

    request.on('row', (columns) => {
        resolve(columns)
        // 'row' , columns
    });
    connection.execSql(request)   
    })
}
module.exports.select = select;

/////////////////////////////////////////////////////
// PUT test

function update(payload){
    return new Promise((resolve, reject) => {
        const sql = `UPDATE OI SET name = @name, gender = @gender,  country = @country, birthdate = @birthdate FROM [pd2Users].[users] as OI WHERE email = @email`;

        const request = new Request(sql, (err) => {
            if (err){
                reject(err)
                console.log(err)
            }
        });
        request.addParameter('name', TYPES.VarChar, payload._name)
        request.addParameter('email', TYPES.VarChar, payload._email)
        request.addParameter('gender', TYPES.VarChar, payload._gender)
        request.addParameter('country', TYPES.VarChar, payload._country)
        request.addParameter('birthdate', TYPES.Date, payload._birthdate)
    
        request.on('requestCompleted', (row) => {
            console.log('User inserted', row)
            resolve('user inserted', row)

        });
        connection.execSql(request)
    });
}
module.exports.update = update


//////////////////////////////////////////////////////
/// TEST DELETE

function removeUser(payload){
    return new Promise((resolve, reject) => {
        const sql = `DELETE from [pd2Users].[users] WHERE email= @email`;
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