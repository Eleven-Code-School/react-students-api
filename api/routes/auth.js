// api/routes/auth.js (añade este al router existente)
import express from "express";
import { authRequired } from "../_lib/auth.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/me", authRequired, async (req, res) => {
    const me = await User.findById(req.user.id).lean();
    if (!me) return res.status(404).json({ error: "User not found" });
    delete me.passwordHash; // extra seguro
    res.json({ user: me });
});

export default router;
