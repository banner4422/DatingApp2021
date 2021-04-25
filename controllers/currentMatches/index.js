var Connection = require('tedious').Connection;
var Request = require('tedious').Request

// the config file is not included because of sensitive data
const config = require('../config.json')

const executeSQL = (context,userId) => {
    var result = '';

    // create connection object
    const connection = new Connection(config);

    // create command to be executed
    const request = new Request(`SELECT theUser.id, theUser.first_name, theUser.last_name, theUser.city, theUser.age, theUser.gender, theUser.gender_interest, theUser.description
    FROM dating.eksempel.tinder_user AS theUser
    INNER JOIN dating.eksempel.match AS matches ON matches.user_id_2 = theUser.id OR matches.user_id_1 = theUser.id
    WHERE matches.user_id_1 = ${userId} OR matches.user_id_2 = ${userId}
    EXCEPT
    SELECT id, first_name, last_name, city, age, gender, gender_interest, description
    FROM dating.eksempel.tinder_user
    WHERE id = ${userId}
    FOR JSON PATH`, function(err){
        if (err){
            context.log.error(err);
            context.res.status = 500;
            context.res.body = 'Error executing T-SQL command';
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
    context.log('Match data has been sent.');
    const userId = (req.query.userId || (req.body && req.body.userId));
    executeSQL(context, userId)
}