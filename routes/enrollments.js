import { t } from "elysia";
import { ERRORS, SWAGGER } from "../constants.js";
import {
    createEnrollment,
    deleteEnrollment,
    getAllEnrollments,
    getEnrollment,
    getEnrollmentsForCourse,
    getEnrollmentsForUser,
    updateEnrollment,
} from "../services/enrollments.js";

export const enrollments = (app) =>
    app
        .get("/", getAllEnrollments, {
            detail: {
                tags: [SWAGGER.ENROLLMENTS],
                summary: "Get all enrollments",
                description: "Retrieves all enrollments.",
            },
        })
        .get("/user/:userId", getEnrollmentsForUser, {
            params: t.Object({
                userId: t.Numeric({ error: ERRORS.INVALID_USER_ID }),
            }),
            detail: {
                tags: [SWAGGER.ENROLLMENTS],
                summary: "Get enrollments by user",
                description: "Retrieves all enrollments for a specific user.",
            },
        })
        .get("/course/:courseId", getEnrollmentsForCourse, {
            params: t.Object({
                courseId: t.Numeric({ error: ERRORS.INVALID_COURSE_ID }),
            }),
            detail: {
                tags: [SWAGGER.ENROLLMENTS],
                summary: "Get enrollments by course",
                description: "Retrieves all enrollments for a specific course.",
            },
        })
        .get("/:id", getEnrollment, {
            params: t.Object({
                id: t.Numeric({ error: ERRORS.INVALID_ENROLLMENT_ID }),
            }),
            detail: {
                tags: [SWAGGER.ENROLLMENTS],
                summary: "Get enrollment by ID",
                description: "Retrieves a specific enrollment by its ID.",
            },
        })
        .post("/", createEnrollment, {
            body: t.Object({
                user_id: t.Numeric({ error: ERRORS.INVALID_USER_ID }),
                course_id: t.Numeric({ error: ERRORS.INVALID_COURSE_ID }),
                active: t.Optional(t.Boolean({ error: ERRORS.INVALID_ACTIVE })),
                ratings: t.Optional(t.Boolean({ error: ERRORS.INVALID_RATINGS })),
            }),
            detail: {
                tags: [SWAGGER.ENROLLMENTS],
                summary: "Create a new enrollment",
                description: "Creates a new enrollment.",
            },
        })
        .patch("/", updateEnrollment, {
            body: t.Object({
                id: t.Numeric({ error: ERRORS.INVALID_ENROLLMENT_ID }),
                user_id: t.Optional(t.Numeric({ error: ERRORS.INVALID_USER_ID })),
                course_id: t.Optional(t.Numeric({ error: ERRORS.INVALID_COURSE_ID })),
                active: t.Optional(t.Boolean({ error: ERRORS.INVALID_ACTIVE })),
                ratings: t.Optional(t.Boolean({ error: ERRORS.INVALID_RATINGS })),
            }),
            detail: {
                tags: [SWAGGER.ENROLLMENTS],
                summary: "Update an enrollment",
                description: "Updates an existing enrollment.",
            },
        })
        .delete("/:id", deleteEnrollment, {
            params: t.Object({
                id: t.Numeric({ error: ERRORS.INVALID_ENROLLMENT_ID }),
            }),
            detail: {
                tags: [SWAGGER.ENROLLMENTS],
                summary: "Delete an enrollment",
                description: "Deletes a specific enrollment by its ID.",
            },
        });

