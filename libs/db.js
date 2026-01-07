// config/database.js
const mysql = require("mysql2");
const { logger } = require("sahas_utils");

// Create a connection pool
const dbConnectionPool = mysql.createPool({
  host: process.env.MYSQL_DB_HOST, // MySQL server address (could be an IP address or 'localhost')
  user: process.env.MYSQL_DB_USERNAME, // MySQL username
  password: process.env.MYSQL_DB_PASSWORD, // MySQL password
  database: process.env.MYSQL_DB_NAME, // Name of the database
  waitForConnections: true, // Enable queuing of requests if the pool is busy
  connectionLimit: 10, // Max number of connections in the pool
  queueLimit: 0, // Unlimited number of requests in the queue -1
  dateStrings: true,
});

async function generateDBTables() {
  const createTablesQuery = [
    // `CREATE TABLE IF NOT EXISTS USERS (
    // id INT AUTO_INCREMENT PRIMARY KEY,
    // full_name VARCHAR(36) NULL,
    // email VARCHAR(48) NOT NULL UNIQUE,
    // phone VARCHAR(13) NULL UNIQUE,
    // image VARCHAR(64) NULL UNIQUE,
    // address VARCHAR(256) NULL,
    // active BOOLEAN NOT NULL DEFAULT TRUE,
    // created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
    // updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    // );
    // `,
  ];

  return Promise.all(
    createTablesQuery.map((query) => executeSQLQueryRaw(query))
  );
}

// Utility function to execute SQL queries using promises
function executeSQLQueryRaw(query) {
  return new Promise((resolve, reject) => {
    dbConnectionPool.getConnection((error, dbConnection) => {
      if (error) {
        logger.error(`Database Connection Failed ${error.message}`);
      } else {
        dbConnection.query(query, (error, result) => {
          logger.info(`Executing ${query}`);
          if (error) {
            console.error("FAILED - ", query, error);
            reject(error); // Reject the promise if the query fails
          } else {
            resolve(result); // Resolve the promise if the query succeeds
          }
          dbConnection.release();
        });
      }
    });
  });
}

function executeSQLQueryParameterized(query, parameters) {
  return new Promise((resolve, reject) => {
    dbConnectionPool.getConnection((error, dbConnection) => {
      if (error) {
        logger.error(`Database Connection Failed ${error.message}`);
      } else {
        dbConnection.execute(query, parameters, (error, result) => {
          logger.info(`Executing ${query} [${parameters}]`);
          if (error) {
            reject(error); // Reject the promise if the query fails
            console.error("FAILED - ", query, error);
          } else {
            resolve(result); // Resolve the promise if the query succeeds
          }
          dbConnection.release();
        });
      }
    });
  });
}

// Export the pool to use in other files
module.exports = {
  generateDBTables,
  executeSQLQueryRaw,
  executeSQLQueryParameterized,
};
