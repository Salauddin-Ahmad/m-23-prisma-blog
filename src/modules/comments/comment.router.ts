import express, { Router } from "express";
import { commentController } from "./comment.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

router.post("/", auth(UserRole.ADMIN, UserRole.USER), commentController.createComment)

router.get("/:commentId", auth(UserRole.ADMIN, UserRole.USER), commentController.getCommentById)

router.get("/author/:authorId", auth(UserRole.ADMIN, UserRole.USER), commentController.getCommentByAuthor)

router.delete("/:commentId", auth(UserRole.ADMIN, UserRole.USER), commentController.deleteComment)

router.patch("/:commentId", auth(UserRole.ADMIN, UserRole.USER), commentController.updateCommentController)

router.patch("/:commentId", auth(UserRole.ADMIN), commentController.moderateComment)

export const commentRouter: Router = router;
