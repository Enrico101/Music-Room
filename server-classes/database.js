var mysql = require('mysql');

class database {
    constructor(host, user, password, database)
    {
        this.host = host; //localhost
        this.user = user; //root
        this.password = password; //Root444@
        this.database = database; //music
    }

    connectToDataBase ()
    {
        var db = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Root444@',
            database: 'hypertube',
            //password: 'Radnic444',
            //socketPath: '/goinfre/enradcli/Desktop/MAMP/mysql/tmp/mysql.sock',
        });

        return db;
    }
}

module.exports = database;