import postService from "../services/posts";
import { type Post } from "../types/Post";
import { setSuccessMessage, addPost, modifyPost } from "../store";
import { useAppSelector, useAppDispatch } from "../hooks";
import { Box, FormControl, TextField, Button } from "@mui/material";
import React from "react";

type Props = {
    handleClose: () => void;
    post: Post;
};

const CreatePost: React.FC<Props> = ({ handleClose, post }: Props) => {
    const [tag, setTag] = React.useState(post.Tag || "");
    const [tagValid, setTagValid] = React.useState("");
    const [content, setContent] = React.useState(post.Content || "");
    const [contentValid, setContentValid] = React.useState("");

    const token = useAppSelector((state) => state.token);
    const dispatch = useAppDispatch();

    const handleTagChange = (event: React.ChangeEvent) => {
        event.preventDefault();
        setTag((event.target as HTMLInputElement).value);
        setTagValid("");
    };

    const handleContentChange = (event: React.ChangeEvent) => {
        event.preventDefault();
        setContent((event.target as HTMLInputElement).value);
        setContentValid("");
    };

    const handleCreatePost = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            if (post.ID) {
                const res = await postService.modifyPost(post.ID, token.Token, { tag, content });
                await dispatch(modifyPost(res));
                await dispatch(setSuccessMessage(`Success! You have edited your existing post with tag ${res.Tag}`));
                handleClose();
            } else {
                const res = await postService.createPost({ tag, content }, token.Token);
                await dispatch(setSuccessMessage(`Success! You have created a post with tag ${res.Tag}`));
                await dispatch(addPost(res));
                handleClose();
            }
        } catch (err) {
            try {
                const obj = JSON.parse((err as Error).message);
                if (obj.Tag) {
                    setTagValid(obj.Tag);
                }
                if (obj.Content) {
                    setContentValid(obj.Content);
                }
                if (!(obj.Tag || obj.Content)) {
                    setTagValid((err as Error).message);
                }
            } catch (e) {
                setTagValid((err as Error).message);
            }
        }
    };

    return (
        <Box
            style={{
                backgroundColor: "white",
                padding: 50,
                textAlign: "center",
                width: "800px",
                height: "600px",
                overflow: "scroll",
            }}
        >
            {post.ID ? <h2>Edit Post</h2> : <h2>Create Post</h2>}
            <br></br>
            <FormControl sx={{ width: 1 }}>
                <TextField
                    id="tag"
                    label="Tag"
                    variant="outlined"
                    sx={{ marginBottom: 2 }}
                    value={tag}
                    onChange={handleTagChange}
                    error={tagValid !== ""}
                    helperText={tagValid}
                />
                <TextField
                    id="content"
                    label="Content"
                    variant="outlined"
                    sx={{ marginBottom: 4 }}
                    value={content}
                    onChange={handleContentChange}
                    error={contentValid !== ""}
                    helperText={contentValid}
                    multiline
                    minRows={15}
                />
                <Button variant="contained" onClick={handleCreatePost}>
                    {post.ID ? `Edit Post` : `Create Post`}
                </Button>
            </FormControl>
        </Box>
    );
};

export default CreatePost;
