import { t } from "elysia";
import { ERRORS, SWAGGER } from "../constants.js";
import {
    createTestimonial,
    deleteTestimonial,
    getAllTestimonials,
    getTestimonial,
    updateTestimonial,
} from "../services/testimonials.js";

export function testimonials(app) {
    return app
        .get("/", getAllTestimonials, {
            detail: {
                tags: [SWAGGER.TESTIMONIALS],
                summary: "Get all testimonials",
                description: "Retrieves all testimonials.",
            },
        })
        .get("/:id", getTestimonial, {
            params: t.Object({
                id: t.Numeric({ error: ERRORS.INVALID_TESTIMONIAL_ID }),
            }),
            detail: {
                tags: [SWAGGER.TESTIMONIALS],
                summary: "Get testimonial by ID",
                description: "Retrieves a specific testimonial by its ID.",
            },
        })
        .post("/", createTestimonial, {
            body: t.Object({
                user_id: t.Numeric({ error: ERRORS.INVALID_USER_ID }),
                course_id: t.Numeric({ error: ERRORS.INVALID_COURSE_ID }),
                testimonial: t.String({ error: ERRORS.INVALID_TESTIMONIAL }),
                ratings: t.Number({ error: ERRORS.INVALID_RATINGS }),
            }),
            detail: {
                tags: [SWAGGER.TESTIMONIALS],
                summary: "Create a new testimonial",
                description: "Creates a new testimonial.",
            },
        })
        .put("/", updateTestimonial, {
            body: t.Object({
                id: t.Numeric({ error: ERRORS.INVALID_TESTIMONIAL_ID }),
                testimonial: t.Optional(t.String({ error: ERRORS.INVALID_TESTIMONIAL })),
                ratings: t.Optional(t.Number({ error: ERRORS.INVALID_RATINGS })),
            }),
            detail: {
                tags: [SWAGGER.TESTIMONIALS],
                summary: "Update a testimonial",
                description: "Updates an existing testimonial.",
            },
        })
        .delete("/:id", deleteTestimonial, {
            params: t.Object({
                id: t.Numeric({ error: ERRORS.INVALID_TESTIMONIAL_ID }),
            }),
            detail: {
                tags: [SWAGGER.TESTIMONIALS],
                summary: "Delete a testimonial",
                description: "Deletes a specific testimonial by its ID.",
            },
        });
}

export default testimonials;
