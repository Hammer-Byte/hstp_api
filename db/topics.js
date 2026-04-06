import { executeSQLQuery } from "../libs/db.js";
const { logger } = require("@hammerbyte/utils");

export async function getTopics() {
    return await executeSQLQuery((sql) => sql`SELECT * FROM TOPICS ORDER BY view_index ASC`)
        .then((result) => [...result])
        .catch((error) => {
            logger.error(`getTopics: ${error}`);
            return [];
        });
}

export async function getTopicById(id) {
    return await executeSQLQuery((sql) => sql`SELECT * FROM TOPICS WHERE id=${id}`)
        .then((result) => (result.length ? result[0] : null))
        .catch((error) => logger.error(`getTopicById: ${error}`));
}

export async function addTopic(topic) {
    return await executeSQLQuery((sql) =>
        sql`INSERT INTO TOPICS ${sql(topic, "title", "duration", "active", "view_index")}`,
    )
        .then((result) => result.lastInsertRowid)
        .catch((error) => logger.error(`addTopic: ${error}`));
}

export async function updateTopicById(id, topic) {
    return await executeSQLQuery((sql) =>
        sql`UPDATE TOPICS SET ${sql(topic, "title", "duration", "active", "view_index")} WHERE id = ${id}`,
    )
        .then((result) => result.affectedRows)
        .catch((error) => logger.error(`updateTopicById: ${error}`));
}

export async function deleteTopicById(id) {
    return await executeSQLQuery((sql) => sql`DELETE FROM TOPICS WHERE id = ${id}`)
        .catch((error) => logger.error(`deleteTopicById: ${error}`));
}

export async function getTopicsByCourseId(courseId) {
    return await executeSQLQuery((sql) => sql`
        SELECT t.* FROM TOPICS t JOIN COURSE_TOPICS ct ON t.id = ct.topic_id
        WHERE ct.course_id = ${courseId}
        ORDER BY t.view_index ASC
    `)
        .then((result) => [...result])
        .catch((error) => {
            logger.error(`getTopicsByCourseId: ${error}`);
            return [];
        });
}

export async function getTopicsByCategoryId(categoryId) {
    return await executeSQLQuery((sql) => sql`
        SELECT t.* FROM TOPICS t 
        JOIN COURSE_TOPICS ct ON t.id = ct.topic_id
        JOIN CATEGORY_COURSES cc ON ct.course_id = cc.course_id
        WHERE cc.category_id = ${categoryId}
        ORDER BY t.id ASC
    `)
        .then((result) => [...result])
        .catch((error) => {
            logger.error(`getTopicsByCategoryId: ${error}`);
            return [];
        });
}

export async function addTopicToCourses(topicId, courseIds) {
    if (!courseIds || !courseIds.length) return;

    for (const courseId of courseIds) {
        await executeSQLQuery((sql) => sql`
            INSERT INTO COURSE_TOPICS (course_id, topic_id) VALUES (${courseId}, ${topicId})
            ON DUPLICATE KEY UPDATE course_id=course_id
        `).catch((error) => logger.error(`addTopicToCourses: ${error}`));
    }
}

export async function removeTopicFromCourses(topicId) {
    return await executeSQLQuery((sql) => sql`DELETE FROM COURSE_TOPICS WHERE topic_id = ${topicId}`)
        .catch((error) => logger.error(`removeTopicFromCourses: ${error}`));
}

