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
    return await executeSQLQuery((sql) => sql`SELECT USER_PROFILE.*, USERS.* FROM USERS LEFT JOIN USER_PROFILE ON USER_PROFILE.user_id = USERS.id WHERE USERS.id=${id}`)
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

async function updateUserById({ id, email, full_name, phone, active, company, address }) {
    try {
        await executeSQLQuery((sql) =>
            sql`UPDATE USERS SET email=${email}, full_name=${full_name}, phone=${phone}, active=${active} WHERE id=${id}`,
        );
        await executeSQLQuery((sql) =>
            sql`UPDATE USER_PROFILE SET company=${company}, address=${address} WHERE user_id=${id}`,
        );
        return true;
    } catch (error) {
        logger.error(`updateUserById: ${error}`);
    }
}

export async function patchUserById(id, body) {
    const existing = await getUserById(id);
    if (!existing) return null;
    const { id: _ignore, email, ...patch } = body;
    return await updateUserById({
        id: Number(id),
        email: email ?? existing.email,
        full_name: "full_name" in patch ? patch.full_name : existing.full_name,
        phone: "phone" in patch ? patch.phone : existing.phone,
        active: "active" in patch ? patch.active : existing.active,
        company: "company" in patch ? patch.company : existing.company ?? null,
        address: "address" in patch ? patch.address : existing.address ?? null,
    });
}

export async function deleteUserById(id) {
    return await executeSQLQuery((sql) => sql`DELETE FROM USERS WHERE id = ${id}`)
        .catch((error) => logger.error(`deleteUserById: ${error}`));
}
