import { t } from "elysia";
import { ERRORS, SWAGGER } from "../constants.js";
import {
    createSubTopic,
    deleteSubTopic,
    getAllSubTopics,
    getSubTopic,
    updateSubTopic,
} from "../services/sub_topics.js";

export function sub_topics(app) {
    return app
        .get("/", getAllSubTopics, {
            detail: {
                tags: [SWAGGER.SUB_TOPICS],
                summary: "Get all sub-topics",
                description: "Retrieves a list of all sub-topics in the system.",
            },
        })
        .get("/:id", getSubTopic, {
            detail: {
                tags: [SWAGGER.SUB_TOPICS],
                summary: "Get sub-topic by ID",
                description: "Retrieves a sub-topic by its ID.",
            },
            params: t.Object({ id: t.Numeric({ error: ERRORS.INVALID_SUB_TOPIC_ID }) }),
        })
        .post("/", createSubTopic, {
            detail: {
                tags: [SWAGGER.SUB_TOPICS],
                summary: "Create sub-topic",
                description: "Creates a new sub-topic and optionally assigns it to topics.",
            },
            body: t.Object({
                topic_id: t.Numeric({ error: ERRORS.INVALID_TOPIC_ID }),
                title: t.String({ error: ERRORS.INVALID_TITLE }),
                duration: t.Numeric({ error: ERRORS.INVALID_DURATION }),
                active: t.Optional(t.Boolean({ error: ERRORS.INVALID_ACTIVE })),
                view_index: t.Optional(t.Numeric({ error: ERRORS.INVALID_VIEW_INDEX })),
            }),
        })
        .put("/", updateSubTopic, {
            detail: {
                tags: [SWAGGER.SUB_TOPICS],
                summary: "Update sub-topic",
                description: "Updates an existing sub-topic. ID must be in the body.",
            },
            body: t.Object({
                id: t.Numeric({ error: ERRORS.INVALID_SUB_TOPIC_ID }),
                topic_id: t.Numeric({ error: ERRORS.INVALID_TOPIC_ID }),
                title: t.Optional(t.String({ error: ERRORS.INVALID_TITLE })),
                duration: t.Optional(t.Numeric({ error: ERRORS.INVALID_DURATION })),
                active: t.Optional(t.Boolean({ error: ERRORS.INVALID_ACTIVE })),
                view_index: t.Optional(t.Numeric({ error: ERRORS.INVALID_VIEW_INDEX })),
            }),
        })
        .delete("/:id", deleteSubTopic, {
            detail: {
                tags: [SWAGGER.SUB_TOPICS],
                summary: "Delete sub-topic",
                description: "Deletes a sub-topic by its ID.",
            },
            params: t.Object({ id: t.Numeric({ error: ERRORS.INVALID_SUB_TOPIC_ID }) }),
        });
}
