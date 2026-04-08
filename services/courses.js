import { ERRORS } from "../constants.js";
import {
    addCourse,
    addCourseToCategories,
    deleteCourseById,
    getCourseById,
    getCourses,
    getCoursesByCategoryId,
    removeCourseFromCategories,
    updateCourseById,
} from "../db/courses.js";

const { logger } = require("@hammerbyte/utils");

export async function getAllCourses({ set }) {
    try {
        const courses = await getCourses();
        set.status = 200;
        return courses;
    } catch (error) {
        logger.error(`GET /courses error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_FETCH_COURSES };
    }
}

export async function getCourse({ params: { id }, set }) {
    try {
        const course = await getCourseById(id);
        if (course) {
            set.status = 200;
            return course;
        }
        set.status = 404;
        return { error: ERRORS.COURSE_NOT_FOUND };
    } catch (error) {
        logger.error(`GET /courses/:id error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_FETCH_COURSE };
    }
}

export async function createCourse({ body, set }) {
    try {
        const { category_ids, ...courseData } = body;
        const result = await addCourse(courseData);
        if (result) {
            if (category_ids && category_ids.length) {
                await addCourseToCategories(result, category_ids);
            }
            set.status = 201;
            const course = await getCourseById(result);
            return course;
        }
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_CREATE_COURSE };
    } catch (error) {
        logger.error(`POST /courses error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_CREATE_COURSE };
    }
}

export async function updateCourse({ body, set }) {
    try {
        const { id, category_ids, ...courseData } = body;

        const result = await updateCourseById(id, courseData);
        if (result !== undefined) {
            if (category_ids) {
                await removeCourseFromCategories(id);
                if (category_ids.length) {
                    await addCourseToCategories(id, category_ids);
                }
            }
            set.status = 200;
            const course = await getCourseById(id);
            return course;
        }
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_UPDATE_COURSE };
    } catch (error) {
        logger.error(`PUT /courses error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_UPDATE_COURSE };
    }
}

export async function deleteCourse({ params: { id }, set }) {
    try {
        await deleteCourseById(id);
        set.status = 200;
    } catch (error) {
        logger.error(`DELETE /courses/:id error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_DELETE_COURSE };
    }
}

export async function getCoursesByCategory({ params: { id }, set }) {
    try {
        const courses = await getCoursesByCategoryId(id);

        if (!courses.length) {
            set.status = 200;
            return {};
        }

        const {
            category_id,
            category_name,
            category_description
        } = courses[0];

        const response = {
            category_id,
            category_name,
            category_description,
            number_of_courses: courses.length,
            number_of_courses: 1, // TEMP
            course_data: courses.map(({ category_id, category_name, category_description, ...course }) => course)
        };

        set.status = 200;
        return response;
    } catch (error) {
        logger.error(`GET /categories/:id/courses error: ${error}`);
        set.status = 400;
        return { error: ERRORS.UNABLE_TO_FETCH_COURSES };
    }
}
