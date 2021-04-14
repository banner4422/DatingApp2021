var Connection = require('tedious').Connection;
var Request = require('tedious').Request

// the config file is not included because of sensitive data
const config = require('../config.json')

const executeSQL = (context, email, password, firstName, lastName, city, age, interest, gender, description, genderInterest, ageInterestMin, ageInterestMax) => {
    var result = '';

    // create connection object
    const connection = new Connection(config);

    // create command to be executed
    const request = new Request(`INSERT INTO dating.eksempel.[user] (email, password, is_admin) VALUES ('${email}', '${password}', 0)
    SET IDENTITY_INSERT dating.eksempel.tinder_user ON
    INSERT INTO dating.eksempel.tinder_user (id, first_name, last_name, city, age, interest, gender, description, gender_interest, age_interest_min, age_interest_max) VALUES (scope_identity(), '${firstName}', '${lastName}', '${city}', ${age}, ${interest}, ${gender}, '${description}', ${genderInterest}, ${ageInterestMin}, ${ageInterestMax})
    SET IDENTITY_INSERT dating.eksempel.tinder_user OFF`, function(err){
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
    context.log('user has been created has been sent.');

    const email = (req.query.email || (req.body && req.body.email))
    const password = (req.query.password || (req.body && req.body.password))
    const firstName = (req.query.firstName || (req.body && req.body.firstName))
    const lastName = (req.query.lastName || (req.body && req.body.lastName))
    const city = (req.query.city || (req.body && req.body.city))
    const age = (req.query.age || (req.body && req.body.age))
    const interest = (req.query.interest || (req.body && req.body.interest))
    const gender = (req.query.gender || (req.body && req.body.gender))
    const description = (req.query.description || (req.body && req.body.description))
    const genderInterest = (req.query.genderInterest || (req.body && req.body.genderInterest))
    const ageInterestMin = (req.query.ageInterestMin || (req.body && req.body.ageInterestMin))
    const ageInterestMax = (req.query.ageInterestMax || (req.body && req.body.ageInterestMax))

    executeSQL(context, email, password, firstName, lastName, city, age, interest, gender, description, genderInterest, ageInterestMin, ageInterestMax)
}