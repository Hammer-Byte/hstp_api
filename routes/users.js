import { t } from "elysia";
import { ERRORS, SWAGGER } from "../constants.js";
import {
    createUserByEmail,
    deleteUser,
    getAllUsers,
    getUser,
    updateUserById,
} from "../services/users.js";

export function users(app) {
    return app
        .get("/", getAllUsers, {
            detail: {
                tags: [SWAGGER.USERS],
                summary: "Get all users",
                description: "Retrieves a list of all users in the system.",
            },
        })
        .get("/:id", getUser, {
            detail: {
                tags: [SWAGGER.USERS],
                summary: "Get user by ID",
                description: "Retrieves a single user by its ID.",
            },
            params: t.Object({
                id: t.Numeric({ error: ERRORS.INVALID_USER_ID }),
            }),
        })
        .post("/email", createUserByEmail, {
            detail: {
                tags: [SWAGGER.USERS],
                summary: "Create user by email",
                description: "Creates or resolves a user record from email only (e.g. OAuth).",
            },
            body: t.Object({
                email: t.String({ error: ERRORS.INVALID_EMAIL }),
            }),
        })
        .put("/:id", updateUserById, {
            detail: {
                tags: [SWAGGER.USERS],
                summary: "Update user",
                description: "Updates an existing user and profile. ID is in the path and repeated in the body.",
            },
            params: t.Object({
                id: t.Numeric({ error: ERRORS.INVALID_USER_ID }),
            }),
            body: t.Object({
                id: t.Numeric({ error: ERRORS.INVALID_USER_ID }),
                email: t.String({ error: ERRORS.INVALID_EMAIL }),
                full_name: t.Optional(t.String({ error: ERRORS.INVALID_FULL_NAME })),
                phone: t.Optional(t.String({ error: ERRORS.INVALID_PHONE })),
                active: t.Optional(t.Boolean({ error: ERRORS.INVALID_ACTIVE })),
                company: t.Optional(t.String({ error: ERRORS.INVALID_COMPANY })),
                address: t.Optional(t.String({ error: ERRORS.INVALID_ADDRESS })),
            }),
        })
        .delete("/:id", deleteUser, {
            detail: {
                tags: [SWAGGER.USERS],
                summary: "Delete user",
                description: "Deletes a user by its ID.",
            },
            params: t.Object({
                id: t.Numeric({ error: ERRORS.INVALID_USER_ID }),
            }),
        });
}

export default users;
