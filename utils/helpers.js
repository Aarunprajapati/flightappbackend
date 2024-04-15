export function getKeyFromCookie(req, key) {
    const cookies = req.headers.cookie.split(';');
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === key) {
            return value;
        }
    }
    return null;
}