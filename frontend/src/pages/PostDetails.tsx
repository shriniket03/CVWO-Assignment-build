import { useAppSelector, useAppDispatch } from "../hooks";
import Menu from "../components/Menu";
import Notification from "../components/Notification";
import CommentsUI from "../components/CommentsUI";
import PostView from "../components/PostView";
import CommentsForm from "../components/CommentsForm";
import { type Post } from "../types/Post";
import { initComments, setErrorMessage } from "../store";
import React from "react";
import { useParams } from "react-router";
import { Box, Card, List } from "@mui/material";

const PostDetails: React.FC = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        dispatch(initComments()).catch((err) => dispatch(setErrorMessage((err as Error).message)));
    }, []);

    const posts = useAppSelector((state) => state.posts);
    const comments = useAppSelector((state) => state.comments);
    const Post: Post = posts.find((post) => post.ID.toString() === id) || ({} as Post);

    return (
        <Box>
            <Menu page={1} />
            <Notification />
            <PostView post={Post} />
            <Card sx={{ textAlign: "left", marginBottom: 3 }}>
                <Box sx={{ marginLeft: 3 }}>
                    <h2>Comments</h2>
                    <List>
                        {comments
                            .filter((comment) => comment.Post === Post.ID)
                            .sort((a, b) => b.Time - a.Time)
                            .map((comment) => (
                                <CommentsUI {...comment} key={comment.ID} />
                            ))}
                    </List>
                    <br></br>
                    <CommentsForm Post={Post} />
                </Box>
            </Card>
        </Box>
    );
};

export default PostDetails;
