import express, { Request, Response } from "express";
import { postsService } from "../domain/postsService";
import { setErrors } from "../lib/errorsHelpers";
import { bloggersService } from "../domain/bloggersService";
import { Post } from "../entity/Post";

export const postsRoute = express.Router();

postsRoute
    .get("/", async (req: Request, res: Response) => {
        const posts = await postsService.findPosts();
        res.status(200).send(posts);
    })
    .get("/:id", async (req: Request<{ id: string }>, res: Response) => {
        const id = parseInt(req.params.id);

        {
            const postValidation = new Post();

            postValidation.id = id;

            const errors = await Post.validate(postValidation);

            if (errors) {
                res.status(400).send(errors);
                return;
            }
        }

        const post = await postsService.findPostById(id);

        if (!post) {
            res.status(404).send(
                setErrors([
                    {
                        field: "",
                        message: `Post doesn't exist`,
                    },
                ])
            );
            return;
        }

        res.status(200).send(post);
    })
    .post(
        "/",
        async (
            req: Request<
                {},
                {},
                {
                    title: string;
                    shortDescription: string;
                    content: string;
                    bloggerId: number;
                }
            >,
            res: Response
        ) => {
            const { title, bloggerId, content, shortDescription } = req.body;

            {
                const postValidation = new Post();

                postValidation.title = title;
                postValidation.bloggerId = bloggerId;
                postValidation.content = content;
                postValidation.shortDescription = shortDescription;

                const errors = await Post.validate(postValidation);

                if (errors) {
                    res.status(400).send(errors);
                    return;
                }
            }

            try {
                const newPost = await postsService.createPost({
                    title,
                    bloggerId,
                    content,
                    shortDescription,
                });

                if (!newPost) {
                    res.status(400).send(
                        setErrors([
                            {
                                field: "",
                                message: `Post doesn't created`,
                            },
                        ])
                    );
                    return;
                }

                res.status(201).send(newPost);
            } catch (error) {
                res.status(400).send(
                    setErrors([
                        {
                            field: "",
                            message: (error as Error).message,
                        },
                    ])
                );
                return;
            }
        }
    )

    .put(
        "/:id",
        async (
            req: Request<
                { id: string },
                {},
                {
                    title: string;
                    shortDescription: string;
                    content: string;
                    bloggerId: number;
                }
            >,
            res: Response
        ) => {
            const { title, bloggerId, content, shortDescription } = req.body;
            const id = parseInt(req.params.id);

            {
                const postValidation = new Post();

                postValidation.id = id;
                postValidation.title = title;
                postValidation.bloggerId = bloggerId;
                postValidation.content = content;
                postValidation.shortDescription = shortDescription;

                const errors = await Post.validate(postValidation);

                if (errors) {
                    res.status(400).send(errors);
                    return;
                }
            }

            try {
                const post = await postsService.updatePost({
                    id,
                    title,
                    shortDescription,
                    bloggerId,
                    content,
                });

                if (!post) {
                    res.status(404).send(
                        setErrors([
                            {
                                field: "",
                                message: `Post doesn't updated`,
                            },
                        ])
                    );
                    return;
                }

                res.status(204).send(post);
            } catch (error) {
                res.status(400).send(
                    setErrors([
                        {
                            field: "",
                            message: (error as Error).message,
                        },
                    ])
                );
                return;
            }
        }
    )
    .delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
        const id = parseInt(req.params.id);

        console.log("id: ", id);

        {
            const postValidation = new Post();

            postValidation.id = id;

            const errors = await Post.validate(postValidation);

            if (errors) {
                res.status(400).send(errors);
                return;
            }
        }

        const isDeleted = await postsService.deletePost(id);

        console.log("isDeleted: ", isDeleted);

        if (!isDeleted) {
            res.status(404).send(
                setErrors([
                    {
                        field: "",
                        message: `Post doesn't deleted`,
                    },
                ])
            );
            return;
        }

        res.sendStatus(204);
    });
