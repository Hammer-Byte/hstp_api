import { ERRORS } from "../constants.js";
import {
    addTestimonial,
    deleteTestimonialById,
    getTestimonialById,
    getTestimonials,
    getTestimonialsByCourseId,
    getTestimonialsByUserId,
    updateTestimonialById,
} from "../db/testimonials.js";

const { logger } = require("@hammerbyte/utils");

export async function getAllTestimonials({ set }) {
    try {
        const testimonials = await getTestimonials();
        set.status = 200;
        return testimonials;
    } catch (error) {
        logger.error(`GET /testimonials error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_FETCH_TESTIMONIALS };
    }
}

export async function getTestimonial({ params: { id }, set }) {
    try {
        const testimonial = await getTestimonialById(id);
        if (testimonial) {
            set.status = 200;
            return testimonial;
        }
        set.status = 404;
        return { error: ERRORS.TESTIMONIAL_NOT_FOUND };
    } catch (error) {
        logger.error(`GET /testimonials/:id error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_FETCH_TESTIMONIAL };
    }
}

export async function createTestimonial({ body, set }) {
    try {
        const result = await addTestimonial(body);
        if (result) {
            set.status = 201;
            const testimonial = await getTestimonialById(result);
            return testimonial;
        }
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_CREATE_TESTIMONIAL };
    } catch (error) {
        logger.error(`POST /testimonials error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_CREATE_TESTIMONIAL };
    }
}

export async function updateTestimonial({ body, set }) {
    try {
        const { id, ...data } = body;

        const result = await updateTestimonialById(id, data);
        if (result) {
            set.status = 200;
            const testimonial = await getTestimonialById(id);
            return testimonial;
        }
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_UPDATE_TESTIMONIAL };
    } catch (error) {
        logger.error(`PUT /testimonials error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_UPDATE_TESTIMONIAL };
    }
}

export async function deleteTestimonial({ params: { id }, set }) {
    try {
        await deleteTestimonialById(id);
        set.status = 200;
        return { message: "Testimonial deleted successfully" };
    } catch (error) {
        logger.error(`DELETE /testimonials/:id error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_DELETE_TESTIMONIAL };
    }
}

export async function getCourseTestimonials({ params: { id }, set }) {
    try {
        const testimonials = await getTestimonialsByCourseId(id);
        set.status = 200;
        return testimonials;
    } catch (error) {
        logger.error(`GET /courses/:id/testimonials error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_FETCH_TESTIMONIALS };
    }
}

export async function getUserTestimonials({ params: { id }, set }) {
    try {
        const testimonials = await getTestimonialsByUserId(id);
        set.status = 200;
        return testimonials;
    } catch (error) {
        logger.error(`GET /users/:id/testimonials error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_FETCH_TESTIMONIALS };
    }
}
