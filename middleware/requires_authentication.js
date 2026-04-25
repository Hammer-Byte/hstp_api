import { ERRORS } from "../constants";

export default function ({ user, set }) {
    if (!user) {
        set.status = 401;
        return { error: ERRORS.UNAUTHORIZED };
    }
}
