import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";

import { categories } from "./routes/categories.js";
import { courses } from "./routes/courses.js";
import { topics } from "./routes/topics.js";
import { sub_topics } from "./routes/sub_topics.js";
import { users } from "./routes/users.js";
import { testimonials } from "./routes/testimonials.js";
import { enrollments } from "./routes/enrollments.js";
import { authentication_tokens } from "./routes/authentication_tokens.js";
import parse_authentication_token from "./middleware/parse_authentication_token.js";
import requiresAuthentication from "./middleware/requires_authentication";

const { logger, middlewares } = require("@hammerbyte/utils");
const baseUrl = process.env.BASE_URL || "http://localhost:3001";

export function createApp() {
    const allowedOrigins = (process.env.ALLOWED_CORS_ORIGINS || "")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);

    return new Elysia()
        .use(
            cors({
                origin: (context) => {
                    const origin = context.headers.origin;
                    if (!origin) return true;
                    return allowedOrigins.includes(origin);
                },
                credentials: true,
                methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
                allowedHeaders: ["Content-Type", "authentication-token"],
            }),
        )
        .use(
            swagger({
                documentation: {
                    info: {
                        title: "HSTP API Documentation",
                        version: "1.0.0",
                    },
                    servers: [
                        {
                            url: baseUrl
                        }
                    ]
                },
            }),
        );
}

export async function allowTraffic(app) {
    app.onRequest(middlewares.bun.requestLogger);
    app.derive({ as: "global" }, parse_authentication_token);


    app.group("/authentication-tokens", authentication_tokens);


    // Routes
    app.guard(
        {
            beforeHandle: [requiresAuthentication],
        },
        (protectedApp) =>
            protectedApp
                .group("/categories", categories)
                .group("/courses", courses)
                .group("/topics", topics)
                .group("/sub-topics", sub_topics)
                .group("/users", users)
                .group("/testimonials", testimonials)
                .group("/enrollments", enrollments),
    );

    // Start server
    app.listen({
        port: process.env.PORT || 3000,
        hostname: process.env.HOST || "0.0.0.0",
    });

    app.decorate("bunServer", app.server);

    logger.success(`server listening on ${app.server.url}`);
}
