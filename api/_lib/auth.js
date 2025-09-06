// api/_lib/auth.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const { JWT_SECRET = "dev-secret", JWT_EXPIRES_IN = "7d" } = process.env;

/* Utilidades */
export async function hashPassword(plain) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(plain, salt);
}
export function signToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}
export function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}

/* Extrae "Bearer <token>" del header Authorization */
function getTokenFromHeader(req) {
    const h = req.headers.authorization || "";
    return h.startsWith("Bearer ") ? h.slice(7) : null;
}

/* Middleware: requiere JWT válido */
export function authRequired(req, res, next) {
    try {
        const token = getTokenFromHeader(req);
        if (!token) return res.status(401).json({ error: "Missing Authorization header" });
        const decoded = verifyToken(token);
        // convención: { sub: userId, role }
        req.user = { id: decoded.sub, role: decoded.role || "user" };
        next();
    } catch (_e) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}

/* Middleware: requiere uno de estos roles (p.ej. 'admin') */
export function requireRole(...allowed) {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ error: "Unauthorized" });
        if (!allowed.includes(req.user.role)) {
            return res.status(403).json({ error: "Forbidden: insufficient role" });
        }
        next();
    };
}

/* (Opcional) Middleware: comprobar “ownership” del recurso
   - Útil cuando quieres permitir a un usuario modificar SOLO sus recursos,
     salvo que sea admin. Recibe una función que devuelva ownerId del recurso. */
export function requireOwnerOrRole(getOwnerId, ...allowedRoles) {
    return async (req, res, next) => {
        try {
            if (!req.user) return res.status(401).json({ error: "Unauthorized" });

            // Si el rol está permitido, pasa
            if (allowedRoles.includes(req.user.role)) return next();

            const ownerId = await getOwnerId(req); // debe devolver un string con el userId dueño
            if (!ownerId) return res.status(404).json({ error: "Resource not found" });

            if (String(ownerId) !== String(req.user.id)) {
                return res.status(403).json({ error: "Forbidden: not the owner" });
            }
            next();
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: "Ownership check failed" });
        }
    };
}
