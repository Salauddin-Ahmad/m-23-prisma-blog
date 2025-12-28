import express, { Application } from 'express'
import { postRouter } from './modules/post/post.router';

const app: Application = express();

app.use(express.json()); // for JSON request bodies
app.use(express.urlencoded({ extended: true })); // for form data


app.use("/posts", postRouter);

app.get("/", (req, res) => {
    res.send("Hello, world");
})
export default app;