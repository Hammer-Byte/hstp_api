import { t } from "elysia";
import { ERRORS, SWAGGER } from "../constants.js";
import {
    createTopic,
    deleteTopic,
    getAllTopics,
    getTopic,
    updateTopic,
} from "../services/topics.js";
import { getSubTopicsByTopic } from "../services/sub_topics.js";

export function topics(app) {
    return app
        .get("/", getAllTopics, {
            detail: {
                tags: [SWAGGER.TOPICS],
                summary: "Get all topics",
                description: "Retrieves a list of all topics in the system.",
            },
        })
        .get("/:id", getTopic, {
            detail: {
                tags: [SWAGGER.TOPICS],
                summary: "Get topic by ID",
                description: "Retrieves a topic by its ID.",
            },
            params: t.Object({ id: t.Numeric({ error: ERRORS.INVALID_TOPIC_ID }) }),
        })
        .post("/", createTopic, {
            detail: {
                tags: [SWAGGER.TOPICS],
                summary: "Create topic",
                description: "Creates a new topic and optionally assigns it to courses.",
            },
            body: t.Object({
                title: t.String({ error: ERRORS.INVALID_TITLE }),
                description: t.Optional(t.String({ error: ERRORS.INVALID_DESCRIPTION })),
                duration: t.Numeric({ error: ERRORS.INVALID_DURATION }),
                active: t.Optional(t.Boolean({ error: ERRORS.INVALID_ACTIVE })),
                view_index: t.Optional(t.Numeric({ error: ERRORS.INVALID_VIEW_INDEX })),
                course_ids: t.Optional(t.Array(t.Numeric(), { error: ERRORS.INVALID_COURSE_ID })),
            }),
        })
        .put("/", updateTopic, {
            detail: {
                tags: [SWAGGER.TOPICS],
                summary: "Update topic",
                description: "Updates an existing topic. ID must be in the body.",
            },
            body: t.Object({
                id: t.Numeric({ error: ERRORS.INVALID_TOPIC_ID }),
                title: t.Optional(t.String({ error: ERRORS.INVALID_TITLE })),
                description: t.Optional(t.String({ error: ERRORS.INVALID_DESCRIPTION })),
                duration: t.Optional(t.Numeric({ error: ERRORS.INVALID_DURATION })),
                active: t.Optional(t.Boolean({ error: ERRORS.INVALID_ACTIVE })),
                view_index: t.Optional(t.Numeric({ error: ERRORS.INVALID_VIEW_INDEX })),
                course_ids: t.Optional(t.Array(t.Numeric(), { error: ERRORS.INVALID_COURSE_ID })),
            }),
        })
        .delete("/:id", deleteTopic, {
            detail: {
                tags: [SWAGGER.TOPICS],
                summary: "Delete topic",
                description: "Deletes a topic by its ID.",
            },
            params: t.Object({ id: t.Numeric({ error: ERRORS.INVALID_TOPIC_ID }) }),
        })
        .get("/:id/sub-topics", getSubTopicsByTopic, {
            detail: {
                tags: [SWAGGER.SUB_TOPICS, SWAGGER.TOPICS],
                summary: "Get sub-topics by topic",
                description: "Retrieves all sub-topics belonging to a specific topic.",
            },
            params: t.Object({ id: t.Numeric({ error: ERRORS.INVALID_TOPIC_ID }) }),
        });
}
