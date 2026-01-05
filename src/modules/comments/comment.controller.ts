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

export const commentController = {
  createComment,
};
