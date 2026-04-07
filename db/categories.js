import { executeSQLQuery } from "../libs/db.js";
const { logger } = require("@hammerbyte/utils");

export async function getCategories() {
    return await executeSQLQuery((sql) => sql`SELECT * FROM CATEGORIES ORDER BY view_index ASC`)
        .then((result) => [...result])
        .catch((error) => {
            logger.error(`getCategories: ${error}`);
            return [];
        });
}

export async function getCategoryById(id) {
    return await executeSQLQuery((sql) => sql`SELECT * FROM CATEGORIES WHERE id=${id}`)
        .then((result) => (result.length ? result[0] : null))
        .catch((error) => logger.error(`getCategoryById: ${error}`));
}

export async function addCategory(category) {
    return await executeSQLQuery((sql) =>
        sql`INSERT INTO CATEGORIES ${sql(category, "title", "description", "image", "view_index")}`,
    )
        .then((result) => result.lastInsertRowid)
        .catch((error) => logger.error(`addCategory: ${error}`));
}

export async function updateCategoryById(id, category) {
    return await executeSQLQuery((sql) =>
        sql`UPDATE CATEGORIES SET ${sql(category, "title", "description", "image", "view_index")} WHERE id = ${id}`,
    )
        .then((result) => result.affectedRows)
        .catch((error) => logger.error(`updateCategoryById: ${error}`));
}

export async function deleteCategoryById(id) {
    return await executeSQLQuery((sql) => sql`DELETE FROM CATEGORIES WHERE id = ${id}`)
        .catch((error) => logger.error(`deleteCategoryById: ${error}`));
}

export async function getAllCategoriesAndCourses() {
    return await executeSQLQuery((sql) => sql`
        SELECT 
            cat.id AS category_id,
            cat.title AS category_name,
            c.*
        FROM CATEGORIES cat
        LEFT JOIN CATEGORY_COURSES cc ON cat.id = cc.category_id
        LEFT JOIN COURSES c ON c.id = cc.course_id
        ORDER BY cat.id, c.view_index ASC
    `)
        .then((result) => [...result])
        .catch((error) => {
            logger.error(`getAllCategoriesAndCourses: ${error}`);
            return [];
        });

}

