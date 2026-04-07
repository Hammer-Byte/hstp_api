import { executeSQLQuery } from "../libs/db.js";
const { logger } = require("@hammerbyte/utils");

export async function getEnrollments() {
    return await executeSQLQuery((sql) => sql`SELECT * FROM ENROLLMENTS ORDER BY created_at DESC`)
        .then((result) => [...result])
        .catch((error) => {
            logger.error(`getEnrollments: ${error}`);
            return [];
        });
}

export async function getEnrollmentById(id) {
    return await executeSQLQuery((sql) => sql`SELECT * FROM ENROLLMENTS WHERE id=${id}`)
        .then((result) => (result.length ? result[0] : null))
        .catch((error) => logger.error(`getEnrollmentById: ${error}`));
}

export async function getEnrollmentsByUserId(userId) {
    return await executeSQLQuery((sql) => sql`SELECT * FROM ENROLLMENTS WHERE user_id=${userId} ORDER BY created_at DESC`)
        .then((result) => [...result])
        .catch((error) => {
            logger.error(`getEnrollmentsByUserId: ${error}`);
            return [];
        });
}

export async function getEnrollmentsByCourseId(courseId) {
    return await executeSQLQuery((sql) => sql`SELECT * FROM ENROLLMENTS WHERE course_id=${courseId} ORDER BY created_at DESC`)
        .then((result) => [...result])
        .catch((error) => {
            logger.error(`getEnrollmentsByCourseId: ${error}`);
            return [];
        });
}

export async function addEnrollment(enrollment) {
    return await executeSQLQuery((sql) =>
        sql`INSERT INTO ENROLLMENTS ${sql(enrollment, "user_id", "course_id", "active", "ratings")}`,
    )
        .then((result) => result?.lastInsertRowid)
        .catch((error) => logger.error(`addEnrollment: ${error}`));
}

export async function updateEnrollmentById(id, enrollment) {
    return await executeSQLQuery((sql) =>
        sql`UPDATE ENROLLMENTS SET ${sql(enrollment, "user_id", "course_id", "active", "ratings")} WHERE id = ${id}`,
    )
        .then((result) => result.affectedRows)
        .catch((error) => logger.error(`updateEnrollmentById: ${error}`));
}

export async function deleteEnrollmentById(id) {
    return await executeSQLQuery((sql) => sql`DELETE FROM ENROLLMENTS WHERE id = ${id}`)
        .catch((error) => logger.error(`deleteEnrollmentById: ${error}`));
}
