// api/_lib/auth.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const { JWT_SECRET = "dev-secret", JWT_EXPIRES_IN = "7d" } = process.env;

/* helpers */
export async function hashPassword(plain) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(plain, salt);
}
export async function verifyPassword(plain, hash) {
    return bcrypt.compare(plain, hash);
}
export function signToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}
export function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}

/* middlewares */
function getBearer(req) {
    const h = req.headers.authorization || "";
    return h.startsWith("Bearer ") ? h.slice(7) : null;
}

export function authRequired(req, res, next) {
    try {
        const token = getBearer(req);
        if (!token) return res.status(401).json({ error: "Missing Authorization header" });
        const decoded = verifyToken(token); // { sub, role, iat, exp }
        req.user = { id: decoded.sub, role: decoded.role || "user" };
        next();
    } catch {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}

export function requireRole(...allowed) {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ error: "Unauthorized" });
        if (!allowed.includes(req.user.role)) {
            return res.status(403).json({ error: "Forbidden: insufficient role" });
        }
        next();
    };
}
