import { Request, Response } from "express";
import { CommentService } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
  try {
    const user = req.user?.id;
    req.body.authorId = user;
    const result = await CommentService.createComment(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    console.error("Comment creation error:", error);
    res.status(400).json({
      error: "Comment creation failed",
      details: error,
    });
  }
};



const getCommentById = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    console.log(commentId)
    if (!commentId) {
      throw new Error("commentId Dont exists")
    }

    const result = await CommentService.getCommentById(commentId as string);
    console.log(result)

    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      error: "Comment fetch failed",
      details: error,
    });
  }
};

const getCommentByAuthor = async (req: Request, res: Response) => {
  try {
    const { authorId } = req.params;
    console.log(authorId)
    if (!authorId) {
      throw new Error("authorId Dont exists")
    }

    const result = await CommentService.getCommentById(authorId as string);
    console.log(result)

    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      error: "Comment fetch failed",
      details: error,
    });
  }
};

export const commentController = {
  createComment,
  getCommentById,
  getCommentByAuthor
};
