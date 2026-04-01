import { t } from "elysia";
import { ERRORS, SWAGGER } from "../constants.js";
import {
    createCategory,
    deleteCategory,
    getAllCategories,
    getCategory,
    updateCategory,
} from "../services/categories.js";

export function categories(app) {
    return app
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
        });
}

export default categories;
