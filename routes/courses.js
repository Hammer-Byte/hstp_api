import { t } from "elysia";
import { ERRORS, SWAGGER } from "../constants.js";
import {
    createCourse,
    deleteCourse,
    getAllCourses,
    getCourse,
    updateCourse,
} from "../services/courses.js";

export function courses(app) {
    return app
        .get("/", getAllCourses, {
            detail: {
                tags: [SWAGGER.COURSES],
                summary: "Get all courses",
                description: "Retrieves a list of all courses in the system.",
            },
        })
        .get("/:id", getCourse, {
            detail: {
                tags: [SWAGGER.COURSES],
                summary: "Get specific course",
                description: "Retrieves a single course by its ID.",
            },
            params: t.Object({
                id: t.Numeric({ error: ERRORS.INVALID_COURSE_ID }),
            }),
        })
        .post("/", createCourse, {
            detail: {
                tags: [SWAGGER.COURSES],
                summary: "Create course",
                description: "Creates a new course and optionally assigns it to categories.",
            },
            body: t.Object({
                title: t.String({ error: ERRORS.INVALID_TITLE }),
                description: t.Optional(t.String({ error: ERRORS.INVALID_DESCRIPTION })),
                image: t.Optional(t.String({ error: ERRORS.INVALID_IMAGE })),
                price: t.Numeric({ error: ERRORS.INVALID_PRICE }),
                active: t.Optional(t.Boolean({ error: ERRORS.INVALID_ACTIVE })),
                view_index: t.Optional(t.Numeric({ error: ERRORS.INVALID_VIEW_INDEX })),
                category_ids: t.Optional(t.Array(t.Numeric(), { error: ERRORS.INVALID_CATEGORY_ID })),
            }),
        })
        .put("/", updateCourse, {
            detail: {
                tags: [SWAGGER.COURSES],
                summary: "Update course",
                description: "Updates an existing course. ID must be in the body.",
            },
            body: t.Object({
                id: t.Numeric({ error: ERRORS.INVALID_COURSE_ID }),
                title: t.Optional(t.String({ error: ERRORS.INVALID_TITLE })),
                description: t.Optional(t.String({ error: ERRORS.INVALID_DESCRIPTION })),
                image: t.Optional(t.String({ error: ERRORS.INVALID_IMAGE })),
                price: t.Optional(t.Numeric({ error: ERRORS.INVALID_PRICE })),
                active: t.Optional(t.Boolean({ error: ERRORS.INVALID_ACTIVE })),
                view_index: t.Optional(t.Numeric({ error: ERRORS.INVALID_VIEW_INDEX })),
                category_ids: t.Optional(t.Array(t.Numeric(), { error: ERRORS.INVALID_CATEGORY_ID })),
            }),
        })
        .delete("/:id", deleteCourse, {
            detail: {
                tags: [SWAGGER.COURSES],
                summary: "Delete course",
                description: "Deletes a course by its ID.",
            },
            params: t.Object({
                id: t.Numeric({ error: ERRORS.INVALID_COURSE_ID }),
            }),
        });
}

export default courses;
