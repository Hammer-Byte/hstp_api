import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";

import { categories } from "./routes/categories.js";
import { courses } from "./routes/courses.js";
import { topics } from "./routes/topics.js";
import { sub_topics } from "./routes/sub_topics.js";
import { users } from "./routes/users.js";
import { testimonials } from "./routes/testimonials.js";

const { logger, middlewares } = require("@hammerbyte/utils");

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
                },
            }),
        );
}

export async function allowTraffic(app) {
    app.onRequest(middlewares.bun.requestLogger);

    // Routes
    app.group("/categories", categories);
    app.group("/courses", courses);
    app.group("/topics", topics);
    app.group("/sub-topics", sub_topics);
    app.group("/users", users);
    app.group("/testimonials", testimonials);

    // Start server
    app.listen({
        port: process.env.PORT || 3000,
        hostname: process.env.HOST || "0.0.0.0",
    });

    app.decorate("bunServer", app.server);

    const { server } = app;

    logger.success(`server listening on http://${server.hostname}:${server.port}`);
}
