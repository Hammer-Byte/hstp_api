import { ERRORS } from "../constants.js";
import {
    activateAuthenticationToken,
    addAuthenticationToken,
    deleteAuthenticationTokenById,
    getAuthenticationTokenById,
    getAuthenticationTokens,
    getAuthenticationTokensByUserId,
    getOtpByUserId,
    getUserByActiveAuthenticationToken,
} from "../db/authentication_tokens.js";
import { addUserByEmail } from "../db/users.js";
import { generateOTP, generateToken } from "../utils.js";

const { logger } = require("@hammerbyte/utils");

export async function getAllAuthenticationTokens({ set }) {
    try {
        const rows = await getAuthenticationTokens();
        set.status = 200;
        return rows;
    } catch (error) {
        logger.error(`GET /authentication-tokens error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_FETCH_AUTHENTICATION_TOKENS };
    }
}

export async function getOtpForUser({ params: { userId }, set }) {
    try {
        const otp = await getOtpByUserId(userId);
        if (otp !== null && otp !== undefined) {
            set.status = 200;
            return { otp };
        }
        set.status = 404;
        return { error: ERRORS.UNABLE_TO_FETCH_AUTHENTICATION_TOKEN };
    } catch (error) {
        logger.error(`GET /authentication-tokens/user/:userId/otp error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_FETCH_AUTHENTICATION_TOKEN };
    }
}

export async function getAuthenticationTokensForUser({ params: { userId }, set }) {
    try {
        const rows = await getAuthenticationTokensByUserId(userId);
        set.status = 200;
        return rows;
    } catch (error) {
        logger.error(`GET /authentication-tokens/user/:userId error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_FETCH_AUTHENTICATION_TOKENS };
    }
}

export async function getAuthenticationToken({ params: { id }, set }) {
    try {
        const row = await getAuthenticationTokenById(id);
        if (row) {
            set.status = 200;
            return row;
        }
        set.status = 404;
        return { error: ERRORS.UNABLE_TO_FETCH_AUTHENTICATION_TOKEN };
    } catch (error) {
        logger.error(`GET /authentication-tokens/:id error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_FETCH_AUTHENTICATION_TOKEN };
    }
}

export async function createAuthenticationToken({ body, set }) {
    try {
        const { email } = body;

        const user_id = await addUserByEmail({ email });
        if (!user_id) {
            set.status = 400;
            return { error: ERRORS.UNABLE_TO_ADD_USER_BY_EMAIL };
        }

        const otp = generateOTP();
        const token = generateToken();

        const id = await addAuthenticationToken({
            user_id,
            otp,
            token,
            active: false,
            validity: new Date(Date.now() + 24 * 60 * 60 * 1000)
        });

        if (id) {
            set.status = 201;
            const row = await getAuthenticationTokenById(id);
            return row;
        }
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_CREATE_AUTHENTICATION_TOKEN };
    } catch (error) {
        logger.error(`POST /authentication-tokens error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_CREATE_AUTHENTICATION_TOKEN };
    }
}

export async function updateAuthenticationToken({ body, set }) {
    try {
        await activateAuthenticationToken(body);

        const user = await getUserByActiveAuthenticationToken(body);

        if (!user) {
            set.status = 401;
            return { error: ERRORS.INVALID_OTP };
        }

        set.status = 200;
        return user;
    } catch (error) {
        logger.error(`PATCH /authentication-tokens error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_UPDATE_AUTHENTICATION_TOKEN };
    }
}

export async function deleteAuthenticationToken({ params: { id }, set }) {
    try {
        await deleteAuthenticationTokenById(id);
        set.status = 200;
        return { message: "Authentication token deleted successfully" };
    } catch (error) {
        logger.error(`DELETE /authentication-tokens/:id error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_DELETE_AUTHENTICATION_TOKEN };
    }
}
