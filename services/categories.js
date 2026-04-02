import { ERRORS } from "../constants.js";
import {
    addCategory,
    deleteCategoryById,
    getCategories,
    getCategoryById,
    updateCategoryById,
} from "../db/categories.js";

const { logger } = require("@hammerbyte/utils");

export async function getAllCategories({ set }) {
    try {
        const categories = await getCategories();
        set.status = 200;
        return categories;
    } catch (error) {
        logger.error(`GET /categories error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_FETCH_CATEGORIES };
    }
}

export async function getCategory({ params: { id }, set }) {
    try {
        const category = await getCategoryById(id);
        if (category) {
            set.status = 200;
            return category;
        }
        set.status = 404;
        return { error: ERRORS.CATEGORY_NOT_FOUND };
    } catch (error) {
        logger.error(`GET /categories/:id error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_FETCH_CATEGORY };
    }
}

export async function createCategory({ body, set }) {
    try {
        const result = await addCategory(body);
        if (result) {
            set.status = 201;
            const category = await getCategoryById(result);
            return category;
        }
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_CREATE_CATEGORY };
    } catch (error) {
        logger.error(`POST /categories error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_CREATE_CATEGORY };
    }
}

export async function updateCategory({ params: { id }, body, set }) {
    try {
        const result = await updateCategoryById(id, body);
        if (result) {
            set.status = 200;
            const category = await getCategoryById(id);
            return category;
        }
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_UPDATE_CATEGORY };
    } catch (error) {
        logger.error(`PUT /categories/:id error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_UPDATE_CATEGORY };
    }
}

export async function deleteCategory({ params: { id }, set }) {
    try {
        await deleteCategoryById(id);
        set.status = 200;
    } catch (error) {
        logger.error(`DELETE /categories/:id error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_DELETE_CATEGORY };
    }
}
