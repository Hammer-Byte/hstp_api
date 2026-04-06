import { ERRORS } from "../constants.js";
import {
    addTopic,
    addTopicToCourses,
    deleteTopicById,
    getTopicById,
    getTopics,
    getTopicsByCourseId,
    removeTopicFromCourses,
    updateTopicById,
} from "../db/topics.js";

const { logger } = require("@hammerbyte/utils");

export async function getAllTopics({ set }) {
    try {
        const topics = await getTopics();
        set.status = 200;
        return topics;
    } catch (error) {
        logger.error(`GET /topics error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_FETCH_TOPICS };
    }
}

export async function getTopic({ params: { id }, set }) {
    try {
        const topic = await getTopicById(id);
        if (topic) {
            set.status = 200;
            return topic;
        }
        set.status = 404;
        return { error: ERRORS.TOPIC_NOT_FOUND };
    } catch (error) {
        logger.error(`GET /topics/:id error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_FETCH_TOPIC };
    }
}

export async function createTopic({ body, set }) {
    try {
        const { course_ids, ...topicData } = body;
        const result = await addTopic(topicData);
        if (result) {
            if (course_ids && course_ids.length) {
                await addTopicToCourses(result, course_ids);
            }
            set.status = 201;
            const topic = await getTopicById(result);
            return topic;
        }
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_CREATE_TOPIC };
    } catch (error) {
        logger.error(`POST /topics error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_CREATE_TOPIC };
    }
}

export async function updateTopic({ body, set }) {
    try {
        const { id, course_ids, ...topicData } = body;
        const result = await updateTopicById(id, topicData);
        if (result !== undefined) {
            if (course_ids) {
                await removeTopicFromCourses(id);
                if (course_ids.length) {
                    await addTopicToCourses(id, course_ids);
                }
            }
            set.status = 200;
            const topic = await getTopicById(id);
            return topic;
        }
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_UPDATE_TOPIC };
    } catch (error) {
        logger.error(`PUT /topics error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_UPDATE_TOPIC };
    }
}

export async function deleteTopic({ params: { id }, set }) {
    try {
        await deleteTopicById(id);
        set.status = 200;
    } catch (error) {
        logger.error(`DELETE /topics/:id error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_DELETE_TOPIC };
    }
}

export async function getTopicsByCourse({ params: { id }, set }) {
    try {
        const topics = await getTopicsByCourseId(id);
        set.status = 200;
        return topics;
    } catch (error) {
        logger.error(`GET /courses/:id/topics error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_FETCH_TOPICS };
    }
}

