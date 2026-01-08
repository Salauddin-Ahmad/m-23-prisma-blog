import express from "express";
import { PostController } from "./post.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN ),
  PostController.createPost
);
router.get(
  "/",
  PostController.getAllPostController
);

router.get(
  "/my-posts",
  auth(UserRole.USER, UserRole.ADMIN),
  PostController.getMyPost
);

router.get(
    "/:postId",
  PostController.getPostById
);

export const postRouter = router;
