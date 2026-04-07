import { SQL } from "bun";
const { logger } = require("@hammerbyte/utils");

export const dbConnection = new SQL({
    adapter: Bun.env.MYSQL_DIALECT,
    hostname: Bun.env.MYSQL_HOST,
    port: Bun.env.MYSQL_PORT,
    database: Bun.env.MYSQL_DB,
    username: Bun.env.MYSQL_USERNAME,
    password: Bun.env.MYSQL_PASSWORD,
    tls: false,
    max: 1,
    onconnect: (client) => {
        logger.success("Connected to MySQL DataBase");
    },
    onclose: (client, error) => {
        if (error) {
            logger.error(`MySQL connection error ${error}`);
        } else {
            logger.info("MySQL connection closed");
        }
    },
});

export async function executeSQLQuery(queryFunction) {
    return await queryFunction(dbConnection);
}

export async function generateDBTables() {
    const db = dbConnection;

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

    await db`
        CREATE TABLE IF NOT EXISTS COURSES (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            image VARCHAR(255),
            price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
            active BOOLEAN DEFAULT TRUE,
            description TEXT,
            duration INT NOT NULL DEFAULT 0,
            view_index INT NOT NULL DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                ON UPDATE CURRENT_TIMESTAMP
        )
    `;

    await db`
        CREATE TABLE IF NOT EXISTS CATEGORY_COURSES (
            id INT AUTO_INCREMENT PRIMARY KEY,
            category_id INT NOT NULL,
            course_id INT NOT NULL,
            FOREIGN KEY (category_id) REFERENCES CATEGORIES(id) ON DELETE CASCADE,
            FOREIGN KEY (course_id) REFERENCES COURSES(id) ON DELETE CASCADE,
            UNIQUE KEY unique_category_course (category_id, course_id)
        )
    `;

    await db`
        CREATE TABLE IF NOT EXISTS TOPICS (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            duration INT NOT NULL DEFAULT 0,
            active BOOLEAN DEFAULT TRUE,
            view_index INT NOT NULL DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                ON UPDATE CURRENT_TIMESTAMP
        )
    `;

    await db`
        CREATE TABLE IF NOT EXISTS COURSE_TOPICS (
            id INT AUTO_INCREMENT PRIMARY KEY,
            course_id INT NOT NULL,
            topic_id INT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (course_id) REFERENCES COURSES(id) ON DELETE CASCADE,
            FOREIGN KEY (topic_id) REFERENCES TOPICS(id) ON DELETE CASCADE,
            UNIQUE KEY unique_course_topic (course_id, topic_id)
        )
    `;

    await db`
        CREATE TABLE IF NOT EXISTS TOPIC_SUB_TOPICS (
            id INT AUTO_INCREMENT PRIMARY KEY,
            topic_id INT NOT NULL,
            title VARCHAR(255) NOT NULL,
            duration INT NOT NULL DEFAULT 0,
            active BOOLEAN DEFAULT TRUE,
            view_index INT NOT NULL DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (topic_id) REFERENCES TOPICS(id) ON DELETE CASCADE
        )
    `;

    await db`
        CREATE TABLE IF NOT EXISTS USERS (
            id INT AUTO_INCREMENT PRIMARY KEY,
            full_name VARCHAR(255),
            phone VARCHAR(255),
            email VARCHAR(255),
            active BOOLEAN DEFAULT TRUE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            UNIQUE KEY unique_users_email (email)
        )
    `;

    await db`
        CREATE TABLE IF NOT EXISTS USER_PROFILE (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            company VARCHAR(255),
            address VARCHAR(512),
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE
        )
    `;

    await db`
        CREATE TABLE IF NOT EXISTS TESTIMONIALS (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            course_id INT NOT NULL,
            testimonial VARCHAR(255),
            ratings BOOLEAN DEFAULT FALSE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE,
            FOREIGN KEY (course_id) REFERENCES COURSES(id) ON DELETE CASCADE
        )
    `;
}
