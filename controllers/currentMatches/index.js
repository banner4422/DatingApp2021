var Connection = require('tedious').Connection;
var Request = require('tedious').Request

// the config file is not included because of sensitive data
const config = require('../config.json')

const executeSQL = (context, userId) => {
    var result = '';

    // create connection object
    const connection = new Connection(config);

    // create command to be executed
    const request = new Request(`SELECT theUser.id, theUser.first_name, theUser.last_name, theUser.city, theUser.age, gender.gender, intrst.interest, genderInterest.gender_Interest, theUser.description
    FROM dating.eksempel.tinder_user AS theUser
    INNER JOIN dating.eksempel.gender AS gender ON theUser.gender = gender.id
    INNER JOIN dating.eksempel.gender_interest AS genderInterest ON theUser.gender = genderInterest.id --HER
    INNER JOIN dating.eksempel.interest AS intrst ON theUser.interest = intrst.id
    INNER JOIN dating.eksempel.match AS matches ON matches.user_id_2 = theUser.id OR matches.user_id_1 = theUser.id
    WHERE matches.user_id_1 = ${userId} OR matches.user_id_2 = ${userId}
    EXCEPT
    SELECT theUseren.id, theUseren.first_name, theUseren.last_name, theUseren.city, theUseren.age, g.gender, i.interest, d.gender_interest, theUseren.description
    FROM dating.eksempel.tinder_user AS theUseren
    INNER JOIN dating.eksempel.gender g ON theUseren.gender = g.id
    INNER JOIN dating.eksempel.gender_interest d ON theUseren.gender = d.id
    INNER JOIN dating.eksempel.interest as I ON theUseren.interest = i.id
    WHERE theUseren.id = ${userId}
    FOR JSON PATH`, function(err){
        if (err){
            context.log.error(err);
            context.res.status = 500;
            context.res.body = 'Error executing T-SQL command for /api/currentMatches';
        } else {
            context.res = {
                body: result
            }
        }
        context.done();
    });

    // execute request
    connection.on('connect', function(err){
        if (err){
            context.log.error(err);
            context.res.status = 500;
            context.res.body = 'Error connecting to Azure SQL query';
            context.done();
        } else {
            connection.execSql(request)
        }
    });

    // handle result send back from azure
    request.on('row', columns => {
        columns.forEach(column => {
            result += column.value
        });
    });

    // connect
    connection.connect();
}
module.exports = function (context, req) {
    const userId = (req.query.userId || (req.body && req.body.userId));
    executeSQL(context, userId)
    context.log(`currentMatches function for userID: ${userId} has been executed successfully`);
}