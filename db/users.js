import { executeSQLQuery } from "../libs/db.js";
const { logger } = require("@hammerbyte/utils");

export async function getUsers() {
    return await executeSQLQuery((sql) => sql`SELECT USER_PROFILE.*, USERS.* FROM USERS LEFT JOIN USER_PROFILE ON USER_PROFILE.user_id = USERS.id ORDER BY USERS.id ASC`)
        .then((result) => [...result])
        .catch((error) => {
            logger.error(`getUsers: ${error}`);
            return [];
        });
}

export async function getUserById(id) {
    return await executeSQLQuery((sql) => sql`SELECT USERS.*, USER_PROFILE.company, USER_PROFILE.address, USER_PROFILE.image  FROM USERS JOIN USER_PROFILE ON USERS.id = USER_PROFILE.user_id WHERE USERS.id=${id}`)
        .then((result) => (result.length ? result[0] : null))
        .catch((error) => logger.error(`getUserById: ${error}`));
}

export async function getUserIdByEmail({ email }) {
    return await executeSQLQuery((sql) => sql`SELECT id FROM USERS WHERE email = ${email}`)
        .then((result) => (result.length ? result[0].id : undefined))
        .catch((error) => logger.error(`getUserIdByEmail: ${error}`));
}

export async function addUserByEmail({ email }) {
    try {
        const result = await executeSQLQuery((sql) => sql`INSERT IGNORE INTO USERS (email, active) VALUES (${email}, 1)`);
        let userId = result?.lastInsertRowid;
        if (!userId) {
            userId = await getUserIdByEmail({ email });
            if (userId === undefined) return false;
        }
        await executeSQLQuery((sql) => sql`INSERT IGNORE INTO USER_PROFILE (user_id) VALUES (${userId})`);
        return userId;
    } catch (error) {
        logger.error(`addUserByEmail: ${error}`);
        return false;
    }
}

export async function updateUserAndProfileById(id, body) {
    const userId = Number(id);
    const { email, full_name, phone, active, company, address, image } = body;
    try {
        const usersResult = await executeSQLQuery((sql) =>
            sql`UPDATE USERS SET email=${email}, full_name=${full_name}, phone=${phone}, active=${active} WHERE USERS.id=${userId}`,
        );
        if (!usersResult?.affectedRows) return null;
        await executeSQLQuery((sql) =>
            sql`UPDATE USER_PROFILE SET company=${company}, address=${address}, image=${image} WHERE USER_PROFILE.user_id=${userId}`,
        );
        return true;
    } catch (error) {
        logger.error(`updateUserAndProfileById: ${error}`);
    }
}

export async function deleteUserById(id) {
    return await executeSQLQuery((sql) => sql`DELETE FROM USERS WHERE id = ${id}`)
        .catch((error) => logger.error(`deleteUserById: ${error}`));
}
