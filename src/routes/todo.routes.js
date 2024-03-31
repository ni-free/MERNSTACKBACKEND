import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addTodo, deleteTodo, getTodo, updateTodo } from "../controllers/todo.controller.js";
const router = Router()

router.route("/add").post(addTodo)
router.put('/update/:id',updateTodo)
router.put('/delete/:id',deleteTodo)
router.put('/get/:id',getTodo)
export default router