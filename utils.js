const { filer } = require("@hammerbyte/utils");

export function generateOTP() {
    //return Math.floor(1000 + Math.random() * 9000).toString();
    //in dev env
    return "1234";
}

export function generateToken() {
    return crypto.randomUUID().replace(/-/g, "").slice(0, 32);
}
