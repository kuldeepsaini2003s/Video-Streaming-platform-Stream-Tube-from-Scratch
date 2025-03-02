import { Router } from "express";
import { comments, createComment } from "../controllers/CommentsController.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/create", verifyToken, createComment);
router.get("/comments/:videoId", comments)

export default router;
