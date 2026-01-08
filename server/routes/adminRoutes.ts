import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";

const adminRoutes = express.Router();

adminRoutes.use(cookieParser());

// Better-auth placeholder
// adminRoutes.post("/api/auth", ...);
export default adminRoutes;
