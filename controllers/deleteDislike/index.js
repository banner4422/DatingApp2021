var Connection = require('tedious').Connection;
var Request = require('tedious').Request

// the config file is not included because of sensitive data
const config = require('../config.json')

const executeSQL = (context) => {
    var result = '';

    // create connection object
    const connection = new Connection(config);

    // create command to be executed
    const request = new Request(`DELETE dis
    FROM dating.eksempel.disliked AS dis
    WHERE dis.date < DATEADD(mi,-5,GETDATE())`, function(err){
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

module.exports = async function (context, myTimer) {
    var timeStamp = new Date().toISOString();
    
    if (myTimer.isPastDue)
    {
        context.log('JavaScript is running late!');
    }
    executeSQL(context)
    context.log('JavaScript timer trigger for the deleteDislike function ran!', timeStamp);   
};