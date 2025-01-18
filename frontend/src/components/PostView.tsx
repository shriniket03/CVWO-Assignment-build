import { type Post } from "../types/Post";
import React from "react";
import { Card, Box, Typography } from "@mui/material";
type Props = {
    post: Post;
};
const PostView: React.FC<Props> = ({ post: Post }) => {
    return (
        <Box>
            <Card sx={{ textAlign: "left" }}>
                <Box sx={{ margin: 3 }}>
                    <h1>
                        <b>{Post.Tag || "Loading Post..."}</b>
                    </h1>
                    <Box sx={{ marginTop: 2 }}>
                        {Post.AuthName ? (
                            <Box sx={{ width: "80vw" }}>
                                <Typography sx={{ color: "grey" }}>
                                    Author: {Post.AuthName} {`(${Post.AuthUsername})`}
                                </Typography>
                                <Typography sx={{ color: "grey" }}>
                                    Posted on:{" "}
                                    {new Date(Post.Time * 1000).toLocaleString("en-GB", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    }) + " at "}
                                    {new Date(Post.Time * 1000).toLocaleString("en-GB", { timeStyle: "medium" })}
                                </Typography>
                                <Typography component={"span"} variant="body1" sx={{ textAlign: "justify" }}>
                                    {Post.Content.split("\n").map((i, key) => {
                                        return <p key={key}>{i}</p>;
                                    })}
                                </Typography>
                            </Box>
                        ) : null}
                    </Box>
                </Box>
            </Card>
            <br></br>
        </Box>
    );
};

export default PostView;
