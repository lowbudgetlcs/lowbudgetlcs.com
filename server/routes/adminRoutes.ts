import { fromNodeHeaders } from "better-auth/node";
import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import { auth } from "../utils/auth";

const adminRoutes = express.Router();

adminRoutes.use(cookieParser());

adminRoutes.get("/api/me", async (req: Request, res: Response) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers)
    });
    return res.json(session);
});
export default adminRoutes;
