import { executeSQLQuery } from "../libs/db.js";
const { logger } = require("@hammerbyte/utils");

export async function getTestimonials() {
    return await executeSQLQuery((sql) => sql`
        SELECT t.*, u.full_name AS user_name, up.image AS image 
        FROM TESTIMONIALS t 
        JOIN USERS u ON t.user_id = u.id
        LEFT JOIN USER_PROFILE up ON up.user_id = u.id
        ORDER BY t.created_at DESC
    `)
        .then((result) => [...result])
        .catch((error) => {
            logger.error(`getTestimonials: ${error}`);
            return [];
        });
}

export async function getTestimonialById(id) {
    return await executeSQLQuery((sql) => sql`SELECT * FROM TESTIMONIALS WHERE id=${id}`)
        .then((result) => (result.length ? result[0] : null))
        .catch((error) => logger.error(`getTestimonialById: ${error}`));
}

export async function addTestimonial(testimonial) {
    return await executeSQLQuery((sql) =>
        sql`INSERT INTO TESTIMONIALS ${sql(testimonial, "user_id", "course_id", "testimonial", "ratings")}`,
    )
        .then((result) => {
            logger.info(`addTestimonial result: ${JSON.stringify(result)}`);
            return result?.lastInsertRowid;
        })
        .catch((error) => logger.error(`addTestimonial: ${error}`));
}

export async function updateTestimonialById(id, testimonial) {
    return await executeSQLQuery((sql) =>
        sql`UPDATE TESTIMONIALS SET ${sql(testimonial, "testimonial", "ratings")} WHERE id = ${id}`,
    )
        .then((result) => result.affectedRows)
        .catch((error) => logger.error(`updateTestimonialById: ${error}`));
}

export async function deleteTestimonialById(id) {
    return await executeSQLQuery((sql) => sql`DELETE FROM TESTIMONIALS WHERE id = ${id}`)
        .catch((error) => logger.error(`deleteTestimonialById: ${error}`));
}

export async function getTestimonialsByCourseId(id) {
    return await executeSQLQuery((sql) => sql`SELECT * FROM TESTIMONIALS WHERE course_id=${id} ORDER BY created_at DESC`)
        .then((result) => [...result])
        .catch((error) => {
            logger.error(`getTestimonialsByCourseId: ${error}`);
            return [];
        });
}

export async function getTestimonialsByUserId(id) {
    return await executeSQLQuery((sql) => sql`SELECT * FROM TESTIMONIALS WHERE user_id=${id} ORDER BY created_at DESC`)
        .then((result) => [...result])
        .catch((error) => {
            logger.error(`getTestimonialsByUserId: ${error}`);
            return [];
        });
}
