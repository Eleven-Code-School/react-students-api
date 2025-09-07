// api/routes/auth.js
import express from "express";
import { authRequired, hashPassword, signToken, verifyPassword } from "../_lib/auth.js";
import { LoginDTO, RegisterDTO, formatValidationError } from "../_lib/schemas.js";
import User from "../models/User.js";

const router = express.Router();

/** POST /api/auth/register */
router.post("/register", async (req, res) => {
    const parsed = RegisterDTO.safeParse(req.body);
    if (!parsed.success) {
        const error = formatValidationError(parsed.error);
        return res.status(400).json({ error });
    }

    const { name, email, password, role } = parsed.data;

    const exists = await User.findOne({ email }).lean();
    if (exists) return res.status(409).json({ error: "Email already exists" });

    const passwordHash = await hashPassword(password);
    const user = await User.create({
        ...parsed.data,
        name,
        email,
        role: role || "user",
        password: passwordHash,
    });

    const token = signToken({ sub: user._id.toString(), role: user.role });
    res.status(201).json({ token, user });
});

/** POST /api/auth/login */
router.post("/login", async (req, res) => {
    const parsed = LoginDTO.safeParse(req.body);
    if (!parsed.success) {
        const error = formatValidationError(parsed.error);
        return res.status(400).json({ error });
    }

    const { email, password } = parsed.data;

    const user = await User.findOne({ email });
    if (!user || !user.password) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await verifyPassword(password, user.password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = signToken({ sub: user._id.toString(), role: user.role });
    res.json({ token, user });
});

/** GET /api/auth/me (protegido) */
router.get("/me", authRequired, async (req, res) => {
    const me = await User.findById(req.user.id).lean();
    if (!me) return res.status(404).json({ error: "User not found" });
    delete me.password;
    res.json({ user: me });
});

/** POST /api/auth/logout */
router.post("/logout", authRequired, async (req, res) => {
    // En una implementación con JWT stateless, el logout se maneja principalmente en el cliente
    // eliminando el token del almacenamiento local/sessionStorage
    // Aquí simplemente confirmamos que el logout fue exitoso
    res.json({
        message: "Logout successful",
        logout: true,
        user: req.user.id,
    });
});

export default router;
