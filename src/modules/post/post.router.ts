import express from "express";
import { PostController } from "./post.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  PostController.createPost
);
router.get("/", PostController.getAllPostController);

router.get(
  "/my-posts",
  auth(UserRole.USER, UserRole.ADMIN),
  PostController.getMyPost
);

router.get(
  "/stats",
  auth(UserRole.ADMIN),
  PostController.getStatsController
);

router.get("/:postId", PostController.getPostById);

router.patch(
  "/:postId",
  auth(UserRole.USER, UserRole.ADMIN),
  PostController.updatePostcontroller
);

router.delete(
  "/:postId",
  auth(UserRole.USER, UserRole.ADMIN),
  PostController.deletePostController
);



export const postRouter = router;
