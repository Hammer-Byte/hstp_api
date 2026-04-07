import { executeSQLQuery } from "../libs/db.js";
const { logger } = require("@hammerbyte/utils");

export async function getAuthenticationTokens() {
    return await executeSQLQuery((sql) => sql`SELECT * FROM AUTHENTICATION_TOKENS ORDER BY created_at DESC`)
        .then((result) => [...result])
        .catch((error) => {
            logger.error(`getAuthenticationTokens: ${error}`);
            return [];
        });
}

export async function getAuthenticationTokenById(id) {
    return await executeSQLQuery((sql) => sql`SELECT * FROM AUTHENTICATION_TOKENS WHERE id=${id}`)
        .then((result) => (result.length ? result[0] : null))
        .catch((error) => logger.error(`getAuthenticationTokenById: ${error}`));
}

export async function getAuthenticationTokensByUserId(userId) {
    return await executeSQLQuery((sql) => sql`SELECT * FROM AUTHENTICATION_TOKENS WHERE user_id=${userId} ORDER BY created_at DESC`)
        .then((result) => [...result])
        .catch((error) => {
            logger.error(`getAuthenticationTokensByUserId: ${error}`);
            return [];
        });
}

export async function getOtpByUserId(userId) {
    return await executeSQLQuery((sql) =>
        sql`SELECT otp FROM AUTHENTICATION_TOKENS WHERE user_id=${userId} ORDER BY created_at DESC LIMIT 1`,
    )
        .then((result) => (result.length ? result[0].otp : null))
        .catch((error) => {
            logger.error(`getOtpByUserId: ${error}`);
            return null;
        });
}

export async function addAuthenticationToken(row) {
    return await executeSQLQuery((sql) =>
        sql`INSERT INTO AUTHENTICATION_TOKENS ${sql(row, "user_id", "otp", "token", "active")}`,
    )
        .then((result) => result?.lastInsertRowid)
        .catch((error) => logger.error(`addAuthenticationToken: ${error}`));
}

export async function updateAuthenticationTokenById(id, row) {
    return await executeSQLQuery((sql) =>
        sql`UPDATE AUTHENTICATION_TOKENS SET ${sql(row, "user_id", "otp", "token", "active")} WHERE id = ${id}`,
    )
        .then((result) => result.affectedRows)
        .catch((error) => logger.error(`updateAuthenticationTokenById: ${error}`));
}

export async function deleteAuthenticationTokenById(id) {
    return await executeSQLQuery((sql) => sql`DELETE FROM AUTHENTICATION_TOKENS WHERE id = ${id}`)
        .catch((error) => logger.error(`deleteAuthenticationTokenById: ${error}`));
}
