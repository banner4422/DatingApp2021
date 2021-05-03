var Connection = require('tedious').Connection;
var Request = require('tedious').Request

// the config file is not included because of sensitive data
const config = require('../config.json')

const LikeFunction = (context, id1, id2) => {
    var result = '';

    // create connection object
    const connection = new Connection(config);

    // create command to be executed
    const request = new Request(`INSERT INTO dating.eksempel.liked (user_id_reciever, user_id_sender) VALUES (${id1}, ${id2})
    SET IDENTITY_INSERT dating.eksempel.liked ON
    SELECT *
    FROM dating.eksempel.liked AS liking
    WHERE (liking.user_id_sender = ${id1} AND liking.user_id_reciever = ${id2}) OR (liking.user_id_sender = ${id2} AND liking.user_id_reciever = ${id1})
    FOR JSON PATH
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

    let like = LikeFunction(context, id1, id2)

    if (like > 1) {
        console.log('det passer haha')
    }

    context.log('like data has been sent.');
}