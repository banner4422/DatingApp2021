var Connection = require('tedious').Connection;
var Request = require('tedious').Request

// the config file is not included because of sensitive data
const config = require('../config.json')

const executeSQL = (context, userID) => {
    var result = '';

    // create connection object
    const connection = new Connection(config);
    
    // create command to be executed
    const request = new Request(`
    DECLARE @id AS INT
DECLARE @interest AS INT
DECLARE @age AS INT
DECLARE @gender_interest AS INT
DECLARE @age_interest_min AS INT
DECLARE @age_interest_max AS INT
SET @id = ${userID}
SET @interest = (SELECT tinder.interest
    FROM dating.eksempel.tinder_user AS tinder
    WHERE tinder.id = @id)
SET @age = (SELECT tinder.age
    FROM dating.eksempel.tinder_user AS tinder
    WHERE tinder.id = @id)
SET @gender_interest = (SELECT tinder.gender_interest
    FROM dating.eksempel.tinder_user AS tinder
    WHERE tinder.id = @id)
SET @age_interest_min = (SELECT tinder.age_interest_min
    FROM dating.eksempel.tinder_user AS tinder
    WHERE tinder.id = @id)
SET @age_interest_max = (SELECT tinder.age_interest_max
    FROM dating.eksempel.tinder_user AS tinder
    WHERE tinder.id = @id)

SELECT
       tinder.id,
       tinder.first_name,
       tinder.last_name,
       tinder.city,
       tinder.age,
       intrst.interest,
       gender.gender,
       tinder.description,
       genderIntrst.gender_interest
FROM dating.eksempel.tinder_user AS tinder
INNER JOIN dating.eksempel.interest AS intrst
    ON tinder.interest = intrst.id
INNER JOIN dating.eksempel.gender AS gender
    ON tinder.gender = gender.id
INNER JOIN dating.eksempel.gender_interest AS genderIntrst
    ON tinder.gender_interest = genderIntrst.id
WHERE (@gender_interest = 1 AND tinder.gender IN (1)
  OR @gender_interest = 2 AND tinder.gender IN (2)
         OR @gender_interest = 3 AND tinder.gender IN (1, 2, 3))
  AND tinder.age BETWEEN @age_interest_min AND @age_interest_max AND tinder.id NOT LIKE @id
ORDER BY abs( tinder.age - @age), CASE intrst.id WHEN @interest THEN @interest END DESC
    FOR JSON PATH`, function(err){
        if (err){
            context.log.error(err);
            context.res.status = 500;
            context.res.body = 'Error executing T-SQL command for /api/getPotentialMatches';
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
    const userID = (req.query.userID || (req.body && req.body.userID));
    executeSQL(context, userID)
    context.log(`Potential matches for userID: ${userID} has been sent successfully`);
}