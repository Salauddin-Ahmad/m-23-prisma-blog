import { Post } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">,
  userId: string
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });

  return result;
};

const getAllPost = async ({
  search,
  tags,
}: {
  search: string | undefined;
  tags: string[] | [];
}) => {
  
  const andConditions: PostWhereInput[]  = [];

  if (search) {
    andConditions.push({
      // group 1 // both group needs to be  true cause its  AND
      OR: [
        {
          title: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: search as string,
          },
        },
      ],
    });
  }

  if (tags.length > 0) {
    andConditions.push({
      // This is group 2
      tags: {
        hasEvery: tags as string[],
      },
    });
  }

  const result = await prisma.post.findMany({
    where: {
      AND: andConditions
    },
  });
  console.log("getting posts");
  return result;
};

export const postService = {
  createPost,
  getAllPost,
};
