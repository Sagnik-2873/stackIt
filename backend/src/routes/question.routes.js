import express from "express";
import {
  getAllQuestions,
  getQuestionById,
  createQuestion,
} from "../controllers/question.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/", getAllQuestions);
router.get("/:id", getQuestionById);
router.post("/", authenticate, createQuestion);

export default router;
