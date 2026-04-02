import { executeSQLQuery } from "../libs/db.js";
const { logger } = require("@hammerbyte/utils");

export async function getSubTopics() {
    return await executeSQLQuery((sql) => sql`SELECT * FROM TOPIC_SUB_TOPICS ORDER BY view_index ASC`)
        .then((result) => [...result])
        .catch((error) => {
            logger.error(`getSubTopics: ${error}`);
            return [];
        });
}

export async function getSubTopicById(id) {
    return await executeSQLQuery((sql) => sql`SELECT * FROM TOPIC_SUB_TOPICS WHERE id=${id}`)
        .then((result) => (result.length ? result[0] : null))
        .catch((error) => logger.error(`getSubTopicById: ${error}`));
}

export async function addSubTopic(subTopic) {
    return await executeSQLQuery((sql) =>
        sql`INSERT INTO TOPIC_SUB_TOPICS ${sql(subTopic, "topic_id", "title", "duration", "active", "view_index")}`,
    )
        .then((result) => result.lastInsertRowid)
        .catch((error) => logger.error(`addSubTopic: ${error}`));
}

export async function updateSubTopicById(id, subTopic) {
    return await executeSQLQuery((sql) =>
        sql`UPDATE TOPIC_SUB_TOPICS SET ${sql(subTopic, "topic_id", "title", "duration", "active", "view_index")} WHERE id = ${id}`,
    )
        .then((result) => result.affectedRows)
        .catch((error) => logger.error(`updateSubTopicById: ${error}`));
}

export async function deleteSubTopicById(id) {
    return await executeSQLQuery((sql) => sql`DELETE FROM TOPIC_SUB_TOPICS WHERE id = ${id}`)
        .catch((error) => logger.error(`deleteSubTopicById: ${error}`));
}

export async function getSubTopicsByTopicId(topicId) {
    return await executeSQLQuery((sql) => sql`SELECT * FROM TOPIC_SUB_TOPICS WHERE topic_id = ${topicId} ORDER BY view_index ASC`)
        .then((result) => [...result])
        .catch((error) => {
            logger.error(`getSubTopicsByTopicId: ${error}`);
            return [];
        });
}
