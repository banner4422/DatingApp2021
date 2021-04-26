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
    SELECT theUser.id, tinder.first_name, tinder.last_name, tinder.city, tinder.age, intrst.interest, gender.gender, tinder.description, genderIntrst.gender_interest, tinder.age_interest_min, tinder.age_interest_max, theUser.email, theUser.password
    FROM dating.eksempel.tinder_user AS tinder
    INNER JOIN dating.eksempel.[user] AS theUser
        ON tinder.id = theUser.id
    INNER JOIN dating.eksempel.interest as intrst
        ON tinder.interest = intrst.id
    INNER JOIN dating.eksempel.gender as gender
        ON tinder.gender = gender.id
    INNER JOIN dating.eksempel.gender_interest as genderIntrst
        ON tinder.gender_interest = genderIntrst.id
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
