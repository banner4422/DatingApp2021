var Connection = require('tedious').Connection;
var Request = require('tedious').Request

// the config file is not included because of sensitive data
const config = require('../config.json')

const executeSQL = (context,userId) => {
    var result = '';

    // create connection object
    const connection = new Connection(config);

    // create command to be executed
    const request = new Request(`
        SELECT tinder_user.id, first_name, last_name, city, age, interest, gender, description, gender_interest, age_interest_min, age_interest_max, email, password, is_admin
    from dating.eksempel.tinder_user
    INNER JOIN dating.eksempel.[user]
    ON dating.eksempel.tinder_user.id = dating.eksempel.[user].id
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
    context.log('Data containing all users has been sent.');
    const userId = (req.query.userId || (req.body && req.body.userId));
    executeSQL(context, userId)
}