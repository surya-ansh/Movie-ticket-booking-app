import express from "express";
import { getAllAdmin, signup } from "../controllers/admin-controller.js";
import { adminLogin } from "../controllers/admin-controller.js";

const adminRouter = express.Router();

adminRouter.post("/signup", signup);
adminRouter.post("/login", adminLogin);
adminRouter.get("/", getAllAdmin);

export default adminRouter;