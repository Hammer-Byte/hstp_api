import { ERRORS } from "../constants.js";
import {
    addUserByEmail,
    deleteUserById,
    getUserById as fetchUserById,
    getUsers,
    updateUserAndProfileById,
} from "../db/users.js";

const { logger } = require("@hammerbyte/utils");

export async function getAllUsers({ set }) {
    try {
        const users = await getUsers();
        set.status = 200;
        return users;
    } catch (error) {
        logger.error(`GET /users error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_FETCH_USERS };
    }
}

export async function getUser({ params: { id }, set }) {
    try {
        const user = await fetchUserById(id);
        if (user) {
            set.status = 200;
            return user;
        }
        set.status = 404;
        return { error: ERRORS.USER_NOT_FOUND };
    } catch (error) {
        logger.error(`GET /users/:id error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_FETCH_USER };
    }
}

export async function createUserByEmail({ body, set }) {
    try {
        const userId = await addUserByEmail(body);
        if (userId === false) {
            set.status = 400;
            return { error: ERRORS.UNABLE_TO_ADD_USER_BY_EMAIL };
        }
        const user = await fetchUserById(userId);
        set.status = 201;
        return user;
    } catch (error) {
        logger.error(`POST /users/email error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_ADD_USER_BY_EMAIL };
    }
}

export async function updateUserById({ params: { id }, body, set }) {
    try {
        const result = await updateUserAndProfileById(id, body);
        if (result === null) {
            set.status = 404;
            return { error: ERRORS.USER_NOT_FOUND };
        }
        if (result === true) {
            set.status = 200;
            const user = await fetchUserById(id);
            return user;
        }
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_UPDATE_USER };
    } catch (error) {
        logger.error(`PUT /users/:id error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_UPDATE_USER };
    }
}

export async function deleteUser({ params: { id }, set }) {
    try {
        await deleteUserById(id);
        set.status = 200;
    } catch (error) {
        logger.error(`DELETE /users/:id error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_DELETE_USER };
    }
}
