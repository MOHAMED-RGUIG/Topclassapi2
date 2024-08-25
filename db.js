const sql = require('mssql');
require("dotenv").config();
// Configuration for the first database for topclass_ges
const config = {
    user: process.env.USER,
    password: process.env.DBPASS,
    server:  process.env.DBSERVER,
    database: process.env.DB1,
    options: {
        encrypt: true,
        trustServerCertificate: true,
        enableArithAbort: true,
    },
    pool: {
        max: 10, // Maximum number of connections
        min: 0, // Minimum number of connections
        idleTimeoutMillis: 30000 // How long a connection can be idle before being closed
    }
};

// Initialize connection pool for topclass_ges
const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('MSSQL connection pool created');
        return pool;
    })
    .catch(err => {
        console.error('Error creating MSSQL connection pool', err);
        process.exit(1); // Exit process on connection failure
    });

// Configuration for the second database (topclass_sage)
const config2 = {
    user: process.env.USER,
    password: process.env.DBPASS,
    server: process.env.DBSERVER,
    database: process.env.DB2,
    options: {
        encrypt: true,
        trustServerCertificate: true,
        enableArithAbort: true,
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

const poolPromise2 = new sql.ConnectionPool(config2)
    .connect()
    .then(pool => {
        console.log('MSSQL connection pool created for topclass_sage');
        return pool;
    })
    .catch(err => {
        console.error('Error creating MSSQL connection pool for topclass_sage', err);
        process.exit(1);
    });

module.exports = {
    sql,
    poolPromise,
    poolPromise2
};
