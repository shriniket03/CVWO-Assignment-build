import { useAppDispatch, useAppSelector } from "../hooks";
import commentService from "../services/comments";
import { type Post } from "../types/Post";
import { addComment, setSuccessMessage } from "../store";
import React from "react";
import { styled } from "@mui/material/styles";
import { FormControl, Button, TextField } from "@mui/material";

type Props = {
    Post: Post;
};

const CommentsForm: React.FC<Props> = ({ Post }: Props) => {
    const [comment, setComment] = React.useState("");
    const [commentValid, setCommentValid] = React.useState("");

    const dispatch = useAppDispatch();
    const token = useAppSelector((state) => state.token);

    const handleCommentChange = (event: React.ChangeEvent) => {
        event.preventDefault();
        setComment((event.target as HTMLInputElement).value);
        setCommentValid("");
    };

    const handlePostComment = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const res = await commentService.createComment({ content: comment, post: Post.ID }, token.Token);
            await dispatch(addComment(res));
            await dispatch(setSuccessMessage(`Success! You have added a comment to Post ${Post.Tag}`));
            setComment("");
        } catch (err) {
            try {
                const obj = JSON.parse((err as Error).message);
                if (obj.Content) {
                    setCommentValid(obj.Content);
                } else {
                    setCommentValid((err as Error).message);
                }
            } catch (e) {
                setCommentValid((err as Error).message);
            }
        }
    };
    return (
        <div>
            {token.Valid ? (
                <FormControl sx={{ width: "95%" }}>
                    <TextFieldWrapper
                        label="   Add Comment"
                        value={comment}
                        onChange={handleCommentChange}
                        error={commentValid != ""}
                        helperText={commentValid}
                    />
                    <Button
                        variant="contained"
                        sx={{ marginBottom: 3, marginTop: 3, width: "fit-content" }}
                        onClick={handlePostComment}
                    >
                        Post Comment
                    </Button>
                </FormControl>
            ) : null}
        </div>
    );
};

export const TextFieldWrapper = styled(TextField)`
    fieldset {
        border-radius: 30px;
    }
    "& fieldset>legend": {
        fontsize: "5em";
    }
`;

export default CommentsForm;
