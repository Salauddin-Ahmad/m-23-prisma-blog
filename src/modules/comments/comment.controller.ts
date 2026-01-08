import { Request, Response } from "express";
import { commentService } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
  try {
    const user = req.user?.id;
    req.body.authorId = user;
    const result = await commentService.createComment(req.body);
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
    console.log(commentId);
    if (!commentId) {
      throw new Error("commentId Dont exists");
    }

    const result = await commentService.getCommentById(commentId as string);
    console.log(result);

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
    console.log(authorId);
    if (!authorId) {
      throw new Error("authorId Dont exists");
    }

    const result = await commentService.getCommentById(authorId as string);
    console.log(result);

    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      error: "Comment fetch failed",
      details: error,
    });
  }
};

const deleteComment = async (req: Request, res: Response) => {
  try {
    const authorId = req.user?.id;

    const { commentId } = req.params;

    console.log(commentId);
    if (!commentId) {
      throw new Error("authorId Dont exists");
    }
    if (!authorId) {
      throw new Error("userId Dont exists");
    }

    const result = await commentService.deleteComment(
      commentId as string,
      authorId as string
    );

    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      error: "Comment delete failed",
      details: error,
    });
  }
};

const updateCommentController = async (req: Request, res: Response) => {
  try {
    const authorId = req.user?.id;
    const { commentId } = req.params;

    const data = req.body;

    if (!data) {
      throw new Error("Request data not found");
    }
    if (!commentId) {
      throw new Error("commentId not found");
    }
    if (!authorId) {
      throw new Error("authorId not found");
    }

    const result = await commentService.updateComment(
      commentId as string,
      data,
      authorId as string
    );

    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      error: "Comment Update failed",
      details: error,
    });
  }
};

const moderateComment = async (req: Request, res: Response) => {
  try {
    
    const {commentId} = req.params;

     if (!commentId) {
      throw new Error("commentId not found");
    }

    const result = await commentService.moderateComment(commentId as string, req.body)

    res.status(200).json(result);
  } catch (error: any) {
    const errorMessage = (error instanceof Error) ? error.message: "Comment Update failed"
    res.status(400).json({
      error: errorMessage,
      details: error,
    });
  }
};



export const commentController = {
  createComment,
  getCommentById,
  getCommentByAuthor,
  deleteComment,
  updateCommentController,
  moderateComment
};
