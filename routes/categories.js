import { t } from "elysia";
import { ERRORS, SWAGGER } from "../constants.js";
import {
    createCategory,
    deleteCategory,
    getAllCategories,
    getCategoriesCourses,
    getCategory,
    updateCategory,
} from "../services/categories.js";
import { getCoursesByCategory } from "../services/courses.js";

export function categories(app) {
    return app
        .get("/popular-courses", getCategoriesCourses, {
            detail: {
                tags: [SWAGGER.CATEGORIES, SWAGGER.COURSES],
                summary: "Get all categories and their courses",
                description: "Retrieves a list of all categories and their courses in the system.",
            },
        })
        .get("/", getAllCategories, {
            detail: {
                tags: [SWAGGER.CATEGORIES],
                summary: "Get all categories",
                description: "Retrieves a list of all categories in the system.",
            },
        })
        .get("/:id", getCategory, {
            detail: {
                tags: [SWAGGER.CATEGORIES],
                summary: "Get specific category",
                description: "Retrieves a single category by its ID.",
            },
            params: t.Object({
                id: t.Numeric({ error: ERRORS.INVALID_CATEGORY_ID }),
            }),
        })
        .post("/", createCategory, {
            detail: {
                tags: [SWAGGER.CATEGORIES],
                summary: "Create category",
                description: "Creates a new category.",
            },
            body: t.Object({
                title: t.String({ error: ERRORS.INVALID_TITLE }),
                description: t.String({ error: ERRORS.INVALID_DESCRIPTION }),
                image: t.String({ error: ERRORS.INVALID_IMAGE }),
                view_index: t.Numeric({ error: ERRORS.INVALID_VIEW_INDEX }),
            }),
        })
        .put("/:id", updateCategory, {
            detail: {
                tags: [SWAGGER.CATEGORIES],
                summary: "Fully update category",
                description: "Updates an existing category completely.",
            },
            params: t.Object({
                id: t.Numeric({ error: ERRORS.INVALID_CATEGORY_ID }),
            }),
            body: t.Object({
                title: t.String({ error: ERRORS.INVALID_TITLE }),
                description: t.String({ error: ERRORS.INVALID_DESCRIPTION }),
                image: t.String({ error: ERRORS.INVALID_IMAGE }),
                view_index: t.Numeric({ error: ERRORS.INVALID_VIEW_INDEX }),
            }),
        })
        .delete("/:id", deleteCategory, {
            detail: {
                tags: [SWAGGER.CATEGORIES],
                summary: "Delete category",
                description: "Deletes a category by its ID.",
            },
            params: t.Object({
                id: t.Numeric({ error: ERRORS.INVALID_CATEGORY_ID }),
            }),
        })
        .get("/:id/courses", getCoursesByCategory, {
            detail: {
                tags: [SWAGGER.CATEGORIES],
                summary: "Get courses by category",
                description: "Retrieves all courses belonging to a specific category.",
            },
            params: t.Object({
                id: t.Numeric({ error: ERRORS.INVALID_CATEGORY_ID }),
            }),
        });
}

export default categories;
