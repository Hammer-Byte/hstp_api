import { getUserByActiveAuthenticationToken } from "../db/authentication_tokens";

export default async function ({ headers, query, set }) {
    // Headers for HTTP requests, query param fallback for WebSocket connections
    // (browsers don't allow custom headers on WS upgrades)
    const authentication_token = headers["authentication-token"] ?? query["authentication-token"];

    if (!authentication_token) {
        return { user: null };
    }

    return {
        user: await getUserByActiveAuthenticationToken({ authentication_token }),
    };
}
