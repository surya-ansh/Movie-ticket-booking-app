import express from "express";
import { getAllUsers, getBookingsOfUser } from "../controllers/userController.js";
import { signup } from "../controllers/userController.js";
import { updateUser } from "../controllers/userController.js";
import { deleteUser } from "../controllers/userController.js";
import { login } from "../controllers/userController.js";

const router = express.Router();


router.get("/", getAllUsers);
router.post("/signup", signup);
router.put("/:id",updateUser);
router.delete("/:id",deleteUser);
router.post("/login", login)
router.get("/bookings/:id",getBookingsOfUser);


export default router;