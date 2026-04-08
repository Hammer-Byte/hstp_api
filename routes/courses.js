import { t } from "elysia";
import { ERRORS, SWAGGER } from "../constants.js";
import {
    createCourse,
    deleteCourse,
    getAllCourses,
    getCourse,
    updateCourse,
} from "../services/courses.js";
import { getTopicsByCourse } from "../services/topics.js";
import { getCourseTestimonials } from "../services/testimonials.js";

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
                duration: t.Optional(t.Numeric({ error: ERRORS.INVALID_DURATION })),
                active: t.Optional(t.Boolean({ error: ERRORS.INVALID_ACTIVE })),
                trending: t.Optional(t.Boolean({ error: ERRORS.INVALID_TRENDING })),
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
                duration: t.Optional(t.Numeric({ error: ERRORS.INVALID_DURATION })),
                active: t.Optional(t.Boolean({ error: ERRORS.INVALID_ACTIVE })),
                trending: t.Optional(t.Boolean({ error: ERRORS.INVALID_TRENDING })),
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
        })
        .get("/:id/topics", getTopicsByCourse, {
            detail: {
                tags: [SWAGGER.TOPICS, SWAGGER.COURSES],
                summary: "Get topics by course",
                description: "Retrieves all topics belonging to a specific course.",
            },
            params: t.Object({ id: t.Numeric({ error: ERRORS.INVALID_COURSE_ID }) }),
        })
        .get("/:id/testimonials", getCourseTestimonials, {
            params: t.Object({
                id: t.Numeric({ error: ERRORS.INVALID_COURSE_ID }),
            }),
            detail: {
                tags: [SWAGGER.TESTIMONIALS, SWAGGER.COURSES],
                summary: "Get testimonials by course",
                description: "Retrieves all testimonials for a specific course.",
            },
        })
}

export default courses;
