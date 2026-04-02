import { ERRORS } from "../constants.js";
import {
    addSubTopic,
    deleteSubTopicById,
    getSubTopicById,
    getSubTopics,
    getSubTopicsByTopicId,
    updateSubTopicById,
} from "../db/sub_topics.js";

const { logger } = require("@hammerbyte/utils");

export async function getAllSubTopics({ set }) {
    try {
        const subTopics = await getSubTopics();
        set.status = 200;
        return subTopics;
    } catch (error) {
        logger.error(`GET /sub-topics error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_FETCH_SUB_TOPICS };
    }
}

export async function getSubTopic({ params: { id }, set }) {
    try {
        const subTopic = await getSubTopicById(id);
        if (subTopic) {
            set.status = 200;
            return subTopic;
        }
        set.status = 404;
        return { error: ERRORS.SUB_TOPIC_NOT_FOUND };
    } catch (error) {
        logger.error(`GET /sub-topics/:id error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_FETCH_SUB_TOPIC };
    }
}

export async function createSubTopic({ body, set }) {
    try {
        const { topic_ids, ...subTopicData } = body;
        const result = await addSubTopic(subTopicData);
        if (result) {
            set.status = 201;
            const subTopic = await getSubTopicById(result);
            return subTopic;
        }
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_CREATE_SUB_TOPIC };
    } catch (error) {
        logger.error(`POST /sub-topics error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_CREATE_SUB_TOPIC };
    }
}

export async function updateSubTopic({ body, set }) {
    try {
        const { id, ...subTopicData } = body;
        const result = await updateSubTopicById(id, subTopicData);
        if (result !== undefined) {
            set.status = 200;
            const subTopic = await getSubTopicById(id);
            return subTopic;
        }
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_UPDATE_SUB_TOPIC };
    } catch (error) {
        logger.error(`PUT /sub-topics error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_UPDATE_SUB_TOPIC };
    }
}

export async function deleteSubTopic({ params: { id }, set }) {
    try {
        await deleteSubTopicById(id);
        set.status = 200;
    } catch (error) {
        logger.error(`DELETE /sub-topics/:id error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_DELETE_SUB_TOPIC };
    }
}

export async function getSubTopicsByTopic({ params: { id }, set }) {
    try {
        const subTopics = await getSubTopicsByTopicId(id);
        set.status = 200;
        return subTopics;
    } catch (error) {
        logger.error(`GET /topics/:id/sub-topics error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_FETCH_SUB_TOPICS };
    }
}
