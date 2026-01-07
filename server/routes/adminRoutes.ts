import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import { appendFile } from "fs";
import passport from "passport";

const adminRoutes = express.Router();

adminRoutes.use(cookieParser());
adminRoutes.use(passport.initialize());
adminRoutes.use(passport.session());

adminRoutes.post(
  "/api/auth",
  passport.authenticate(process.env.PRODUCTION === "production" ? "production" : "local"),
  (req: Request, res: Response) => {
    res.json({ message: "Login successful", user: req.user });
  }
);
export default adminRoutes;
