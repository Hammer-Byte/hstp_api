import { executeSQLQuery } from "../libs/db.js";
const { logger } = require("@hammerbyte/utils");

export async function getCourses() {
    return await executeSQLQuery((sql) => sql`
        SELECT 
            c.*,
            GROUP_CONCAT(DISTINCT cat.title ORDER BY cat.title SEPARATOR ', ') AS category_names,
            CAST(ROUND(AVG(t.ratings), 1) AS CHAR) AS avg_rating,
            COUNT(DISTINCT t.id) AS total_ratings
        FROM COURSES c
        LEFT JOIN CATEGORY_COURSES cc ON cc.course_id = c.id
        LEFT JOIN CATEGORIES cat ON cat.id = cc.category_id
        LEFT JOIN TESTIMONIALS t ON t.course_id = c.id
        GROUP BY c.id
        ORDER BY c.view_index ASC
    `)
        .then((result) => [...result])
        .catch((error) => {
            logger.error(`getCourses: ${error}`);
            return [];
        });
}

export async function getCourseById(id) {
    return await executeSQLQuery((sql) => sql`SELECT * FROM COURSES WHERE id=${id}`)
        .then((result) => (result.length ? result[0] : null))
        .catch((error) => logger.error(`getCourseById: ${error}`));
}

export async function addCourse(course) {
    return await executeSQLQuery((sql) =>
        sql`INSERT INTO COURSES ${sql(course, "title", "description", "duration", "image", "price", "trending", "active", "view_index")}`,
    )
        .then((result) => result.lastInsertRowid)
        .catch((error) => logger.error(`addCourse: ${error}`));
}

export async function updateCourseById(id, course) {
    return await executeSQLQuery((sql) =>
        sql`UPDATE COURSES SET ${sql(course, "title", "description", "duration", "image", "price", "trending", "active", "view_index")} WHERE id = ${id}`,
    )
        .then((result) => result.affectedRows)
        .catch((error) => logger.error(`updateCourseById: ${error}`));
}

export async function deleteCourseById(id) {
    return await executeSQLQuery((sql) => sql`DELETE FROM COURSES WHERE id = ${id}`)
        .catch((error) => logger.error(`deleteCourseById: ${error}`));
}

export async function getCoursesByCategoryId(categoryId) {
    return await executeSQLQuery((sql) => sql`
        SELECT 
            c.*,
            cat.id AS category_id,
            cat.title AS category_name,
            cat.description AS category_description
        FROM COURSES c
        JOIN CATEGORY_COURSES cc ON c.id = cc.course_id
        JOIN CATEGORIES cat ON cat.id = cc.category_id
        WHERE cc.category_id = ${categoryId}
        ORDER BY c.view_index ASC
    `)
        .then((result) => [...result])
        .catch((error) => {
            logger.error(`getCoursesByCategoryId: ${error}`);
            return [];
        });
}

export async function addCourseToCategories(courseId, categoryIds) {
    if (!categoryIds || !categoryIds.length) return;

    for (const categoryId of categoryIds) {
        await executeSQLQuery((sql) => sql`
            INSERT INTO CATEGORY_COURSES (category_id, course_id)
            VALUES (${categoryId}, ${courseId})
            ON DUPLICATE KEY UPDATE category_id=category_id
        `).catch((error) => logger.error(`addCourseToCategory: ${error}`));
    }
}

export async function removeCourseFromCategories(courseId) {
    return await executeSQLQuery((sql) => sql`DELETE FROM CATEGORY_COURSES WHERE course_id = ${courseId}`)
        .catch((error) => logger.error(`removeCourseFromCategories: ${error}`));
}
