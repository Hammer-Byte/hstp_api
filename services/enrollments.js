import { ERRORS } from "../constants.js";
import {
    addEnrollment,
    deleteEnrollmentById,
    getEnrollmentById,
    getEnrollments,
    getEnrollmentsByCourseId,
    getEnrollmentsByUserId,
    updateEnrollmentById,
} from "../db/enrollments.js";

const { logger } = require("@hammerbyte/utils");

export async function getAllEnrollments({ set }) {
    try {
        const enrollments = await getEnrollments();
        set.status = 200;
        return enrollments;
    } catch (error) {
        logger.error(`GET /enrollments error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_FETCH_ENROLLMENTS };
    }
}

export async function getEnrollmentsForUser({ params: { userId }, set }) {
    try {
        const enrollments = await getEnrollmentsByUserId(userId);
        set.status = 200;
        return enrollments;
    } catch (error) {
        logger.error(`GET /enrollments/user/:userId error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_FETCH_ENROLLMENTS };
    }
}

export async function getEnrollmentsForCourse({ params: { courseId }, set }) {
    try {
        const enrollments = await getEnrollmentsByCourseId(courseId);
        set.status = 200;
        return enrollments;
    } catch (error) {
        logger.error(`GET /enrollments/course/:courseId error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_FETCH_ENROLLMENTS };
    }
}

export async function getEnrollment({ params: { id }, set }) {
    try {
        const enrollment = await getEnrollmentById(id);
        if (enrollment) {
            set.status = 200;
            return enrollment;
        }
        set.status = 404;
        return { error: ERRORS.UNABLE_TO_FETCH_ENROLLMENT };
    } catch (error) {
        logger.error(`GET /enrollments/:id error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_FETCH_ENROLLMENT };
    }
}

export async function createEnrollment({ body, set }) {
    try {
        const id = await addEnrollment(body);
        if (id) {
            set.status = 201;
            const enrollment = await getEnrollmentById(id);
            return enrollment;
        }
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_CREATE_ENROLLMENT };
    } catch (error) {
        logger.error(`POST /enrollments error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_CREATE_ENROLLMENT };
    }
}

export async function updateEnrollment({ body, set }) {
    try {
        const { id, ...data } = body;
        const result = await updateEnrollmentById(id, data);
        if (result) {
            set.status = 200;
            const enrollment = await getEnrollmentById(id);
            return enrollment;
        }
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_UPDATE_ENROLLMENT };
    } catch (error) {
        logger.error(`PATCH /enrollments error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_UPDATE_ENROLLMENT };
    }
}

export async function deleteEnrollment({ params: { id }, set }) {
    try {
        await deleteEnrollmentById(id);
        set.status = 200;
        return { message: "Enrollment deleted successfully" };
    } catch (error) {
        logger.error(`DELETE /enrollments/:id error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_DELETE_ENROLLMENT };
    }
}

