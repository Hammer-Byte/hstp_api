import { SQL } from "bun";

let mysqlConnection = null;

export function getMySQLDataBaseConnection() {
    if (!mysqlConnection) {
        mysqlConnection = new SQL({
            adapter: "mysql",
            hostname: process.env.MYSQL_DB_HOST || "localhost",
            port: Number(process.env.MYSQL_DB_PORT) || 3306,
            database: process.env.MYSQL_DB_NAME || "hstp_dev",
            username: process.env.MYSQL_DB_USERNAME || "root",
            password: process.env.MYSQL_DB_PASSWORD || "1234",
        });
    }

    return mysqlConnection;
}

export async function executeSQLQuery(queryFunction) {
    return await queryFunction(getMySQLDataBaseConnection());
}

export async function generateDBTables() {
    const db = getMySQLDataBaseConnection();

    await db`
        CREATE TABLE IF NOT EXISTS CATEGORIES (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description VARCHAR(255),
            image VARCHAR(255),
            view_index INT NOT NULL DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                ON UPDATE CURRENT_TIMESTAMP
        )
    `;
}
