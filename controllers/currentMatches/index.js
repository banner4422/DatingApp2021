var Connection = require('tedious').Connection;
var Request = require('tedious').Request

// the config file is not included because of sensitive data
const config = require('../config.json')

const executeSQL = (context,userId) => {
    var result = '';

    // create connection object
    const connection = new Connection(config);

    // create command to be executed
    const request = new Request(`SELECT first_name, last_name,city, age, description from dating.eksempel.tinder_user
    INNER JOIN dating.eksempel.match ON (dating.eksempel.match.user_id_2 = dating.eksempel.tinder_user.id)
    WHERE dating.eksempel.match.user_id_1 = ${userId} OR dating.eksempel.match.user_id_2 = ${userId}
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