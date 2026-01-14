import { Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";
import { UserRole } from "../../middlewares/auth";

const createPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        error: "Unauthorized",
      });
    }

    const result = await postService.createPost(req.body, user.id as string);

    res.status(201).json(result);
  } catch (error: any) {
    console.error("Post creation error:", error);
    res.status(400).json({
      error: "post creation failed",
      details: error,
    });
  }
};

const getAllPostController = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;

    const searchString = typeof search === "string" ? search : undefined;

    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];

    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === "true"
        ? true
        : req.query.isFeatured === "false"
        ? false
        : undefined
      : undefined;

    const status = req.query.status as PostStatus | undefined;
    const authorId = req.query.authorId as string;
    // const page = Number(req.query.page ?? 1);
    // const limit = Number(req.query.limit ?? 10);
    // const skip = (page - 1) * limit;
    // const sortBy = req.query.sortBy as string | undefined;
    // const sortOrder = req.query.SortOrder as string | undefined;

    const options = paginationSortingHelper(req.query);

    const { page, limit, skip, sortBy, sortOrder } = options;

    console.log("options", options);

    const result = await postService.getAllPost({
      search: searchString,
      tags,
      isFeatured,
      status,
      authorId,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });
    res.status(200).json({ result });
  } catch (error) {
    res.status(200).json({
      error: "Post creation failed",
      details: error,
    });
  }
};

const getPostById = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    console.log(postId);
    if (!postId) {
      throw new Error("Post Id is required");
    }

    const result = await postService.getPostById(postId);
    res.status(200).json(result);
  } catch (error: any) {
    console.error("Post creation error:", error);
    res.status(400).json({
      error: "Geting ",
      details: error,
    });
  }
};

const getMyPost = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    console.log(req.user);
    if (!userId) {
      throw new Error("You are not Authorized");
    }

    const result = await postService.getMyPosts(userId as string);
    res.status(200).json(result);
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "Getting posts failed";
    res.status(400).json({
      error: errorMessage,
      details: error,
    });
  }
};


const updatePostcontroller = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    console.log(req.user);
    if (!userId) {
      throw new Error("You are not Authorized");
    }
    const { postId } = req.params;

    const isAdmin = req?.user?.role === UserRole.ADMIN

    const result = await postService.updatePost(
      postId as string,
      req.body,
      isAdmin,
      userId
    );
    res.status(200).json(result);
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "Posts update failed";
    res.status(400).json({
      error: errorMessage,
      details: error,
    });
  }
};

const deletePostController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    console.log(req.user);
    if (!userId) {
      throw new Error("You are not Authorized");
    }
    const { postId } = req.params;

    const isAdmin = req?.user?.role === UserRole.ADMIN

    const result = await postService.deletePost(
      postId as string,
      userId,
      isAdmin,
    );
    console.log(result)
    res.status(200).json(result);
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "Posts delete failed!";
    res.status(400).json({
      error: errorMessage,
      details: error,
    });
  }
};

const getStatsController = async (req: Request, res: Response) => {
  try {
   
    const result = await postService.getStats(
    );
    
    res.status(200).json(result);
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "Fetching stats failed";
    res.status(400).json({
      error: errorMessage,
      details: error,
    });
  }
};




export const PostController = {
  createPost,
  getAllPostController,
  getPostById,
  getMyPost,
  updatePostcontroller,
  deletePostController,
  getStatsController

};
