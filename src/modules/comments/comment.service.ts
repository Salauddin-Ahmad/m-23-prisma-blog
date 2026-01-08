import { CommentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const createComment = async (payload: {
  content: string;
  authorId: string;
  postId: string;
  parentId?: string;
}) => {
  await prisma.post.findUniqueOrThrow({
    where: {
      id: payload.postId,
    },
  });

  if (payload.parentId) {
    await prisma.comment.findUniqueOrThrow({
      where: {
        id: payload.parentId,
      },
    });
  }

  return await prisma.comment.create({
    data: payload,
  });
};

const getCommentById = async (id: string) => {
  console.log("hit service ");
  return await prisma.comment.findUnique({
    where: {
      id,
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
          views: true,
        },
      },
    },
  });
};

const getCommentByAuthor = async (authorId: string) => {
  return await prisma.comment.findMany({
    where: {
      authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
};

const deleteComment = async (commentId: string, authorId: string) => {
  console.log({ commentId, authorId });

  const commentData = await prisma.comment.findFirst({
    where: {
      id: commentId,
      authorId,
    },
    select: {
      id: true,
    },
  });

  if (!commentData) {
    throw new Error("Your provided input is invaild");
  }

  return await prisma.comment.delete({
    where: {
      id: commentData.id,
    },
  });
};

const updateComment = async (
  commentId: string,
  data: { content: string; status: CommentStatus },
  authorId: string
) => {
  console.log({
    commennt: commentId,
    Author: authorId,
    data,
  });

  const commentData = await prisma.comment.findFirst({
    where: {
      id: commentId,
      authorId,
    },
  });

  if (!commentData) {
    throw new Error("Your provided input is invalid");
  }

  return await prisma.comment.update({
    where: {
      id: commentData.id,
    },
    data,
  });
};

const moderateComment = async (id: string, data: { status: CommentStatus }) => {
  const commentData = await prisma.comment.findUniqueOrThrow({
    where: {
      id,
    },
    select: {
      id: true,
      status: true
    }
  });

  if (commentData.status === data.status) {
    throw new Error(
      `Your provided status (${data.status}) is already update to date`
    );
  }

  return await prisma.comment.update({
    where: {
      id,
    },
    data,
  });
};

export const commentService = {
  createComment,
  getCommentById,
  getCommentByAuthor,
  deleteComment,
  updateComment,
  moderateComment,
};
