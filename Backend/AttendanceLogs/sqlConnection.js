const sql = require('mssql');

const config = {
    user: 'sa',
    password: '@pplec1t',
    server: '192.168.1.4',
    database: 'etimetracklite1',
    port: 1433,
    options: {
        encrypt: false, // Set to true if using Azure
        trustServerCertificate: true, // Allow self-signed certs
    },
};

async function connectToSQL() {
    try {
        const pool = await sql.connect(config);
        return pool;
        console.log('Connected to SQL Server successfully');
    } catch (err) {
        console.error('SQL Connection Error:', err);
        throw err;
    }
}

module.exports = connectToSQL;
