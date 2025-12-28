import { Request, Response } from "express";

const createPost = async (req: Request, res: Response) => {

    console.log({req, res})
    res.send('create a new post');
}

export const PostController = {
   createPost 
}