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
    SELECT
       theUser.id,
       tinder.first_name,
       tinder.last_name,
       tinder.city,
       tinder.age,
       intrst.interest,
       gender.gender,
       tinder.description,
       genderIntrst.gender_interest,
       tinder.age_interest_min,
       tinder.age_interest_max,
       theUser.email,
       theUser.password,
       theUser.is_admin,
       count(DISTINCT match.id) AS matches
FROM dating.eksempel.tinder_user AS tinder
INNER JOIN dating.eksempel.[user] AS theUser
    ON tinder.id = theUser.id
INNER JOIN dating.eksempel.interest AS intrst
    ON tinder.interest = intrst.id
INNER JOIN dating.eksempel.gender AS gender
    ON tinder.gender = gender.id
INNER JOIN dating.eksempel.gender_interest AS genderIntrst
    ON tinder.gender_interest = genderIntrst.id
LEFT JOIN dating.eksempel.match AS match
    ON tinder.id = match.user_id_1 OR tinder.id = match.user_id_2
GROUP BY theUser.id, tinder.first_name, tinder.last_name, tinder.city, tinder.age, intrst.interest, gender.gender, tinder.description, genderIntrst.gender_interest, tinder.age_interest_min, tinder.age_interest_max, theUser.email, theUser.password, theUser.is_admin
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