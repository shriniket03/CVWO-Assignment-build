import { useAppDispatch, useAppSelector } from "../hooks";
import { deletePost } from "../store";
import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

type Props = {
    open: boolean;
    handleClose: () => void;
    id: number;
};
export default function AlertDialog({ open, handleClose, id }: Props) {
    const dispatch = useAppDispatch();
    const token = useAppSelector((state) => state.token);
    const handleDelete = (id: number) => {
        dispatch(deletePost(id, token.Token));
    };
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{"Are you sure you want to delete this post?"}</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ textAlign: "justify" }}>
                    Deleting a post is an irreversible action. Are you sure you want to delete this post?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={() => handleDelete(id)} sx={{ marginRight: 3, color: "red" }} autoFocus>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}
