var Connection = require('tedious').Connection;
var Request = require('tedious').Request

// the config file is not included because of sensitive data
const config = require('../config.json')

const Matching = (context, id1, id2) => {
    var result = '';

    // create connection object
    const connection = new Connection(config);

    // create command to be executed
    const request = new Request(`INSERT INTO dating.eksempel.match (user_id_1, user_id_2) VALUES (${id1}, ${id2})
    SET IDENTITY_INSERT dating.eksempel.liked ON
    DELETE
    FROM dating.eksempel.liked
    WHERE user_id_reciever = ${id1} AND user_id_sender = ${id2}
    OR
    user_id_sender = ${id1} AND user_id_reciever = ${id2}
    SET IDENTITY_INSERT dating.eksempel.liked OFF
    `, function(err){
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
    const id1 = (req.query.id1 || (req.body && req.body.id1));
    const id2 = (req.query.id2 || (req.body && req.body.id2));

    Matching(context, id1, id2)

    context.log(`Match between userID: ${id2} and ${id1} was successful`);
}