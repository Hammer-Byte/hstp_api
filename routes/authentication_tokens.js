import { t } from "elysia";
import { ERRORS, SWAGGER } from "../constants.js";
import {
    createAuthenticationToken,
    deleteAuthenticationToken,
    getAllAuthenticationTokens,
    getAuthenticationToken,
    getAuthenticationTokensForUser,
    getOtpForUser,
    updateAuthenticationToken,
} from "../services/authentication_tokens.js";

export const authentication_tokens = (app) =>
    app
        .get("/", getAllAuthenticationTokens, {
            detail: {
                tags: [SWAGGER.AUTHENTICATION_TOKENS],
                summary: "Get all authentication tokens",
                description: "Retrieves all authentication tokens.",
            },
        })
        .get("/user/:userId/otp", getOtpForUser, {
            params: t.Object({
                userId: t.Numeric({ error: ERRORS.INVALID_USER_ID }),
            }),
            detail: {
                tags: [SWAGGER.AUTHENTICATION_TOKENS],
                summary: "Get latest OTP by user",
                description: "Returns the OTP from the most recent authentication token row for this user (for verification).",
            },
        })
        .get("/user/:userId", getAuthenticationTokensForUser, {
            params: t.Object({
                userId: t.Numeric({ error: ERRORS.INVALID_USER_ID }),
            }),
            detail: {
                tags: [SWAGGER.AUTHENTICATION_TOKENS],
                summary: "Get authentication tokens by user",
                description: "Retrieves all authentication tokens for a specific user.",
            },
        })
        .get("/:id", getAuthenticationToken, {
            params: t.Object({
                id: t.Numeric({ error: ERRORS.INVALID_AUTHENTICATION_TOKEN_ID }),
            }),
            detail: {
                tags: [SWAGGER.AUTHENTICATION_TOKENS],
                summary: "Get authentication token by ID",
                description: "Retrieves a specific authentication token by its ID.",
            },
        })
        .post("/", createAuthenticationToken, {
            body: t.Object({
                email: t.String({
                    format: "email",
                    error: ERRORS.INVALID_EMAIL,
                }),
            }),
            detail: {
                tags: [SWAGGER.AUTHENTICATION_TOKENS],
                summary: "Create authentication token",
                description: "Creates a new authentication token row for the given email.",
            },
        })
        .patch("/", updateAuthenticationToken, {
            body: t.Object({
                authentication_token: t.String({ pattern: "^.{32}$", error: ERRORS.INVALID_AUTH_TOKEN }),
                otp: t.String({ pattern: "^[0-9]{4}$", error: ERRORS.INVALID_OTP }),
            }),
            detail: {
                tags: [SWAGGER.AUTHENTICATION_TOKENS],
                summary: "Update authentication token",
                description: "Updates an existing authentication token.",
            },
        })
        .delete("/:id", deleteAuthenticationToken, {
            params: t.Object({
                id: t.Numeric({ error: ERRORS.INVALID_AUTHENTICATION_TOKEN_ID }),
            }),
            detail: {
                tags: [SWAGGER.AUTHENTICATION_TOKENS],
                summary: "Delete authentication token",
                description: "Deletes a specific authentication token by its ID.",
            },
        });
