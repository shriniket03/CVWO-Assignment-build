import Dialog from "./Dialog";
import CreatePost from "../pages/CreatePost";
import { type Post } from "../types/Post";
import { addPostLike } from "../store";
import { useAppSelector, useAppDispatch, useWindowDimensions } from "../hooks";
import React from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import { Modal, Box } from "@mui/material";

interface Props {
    owner: number;
    postID: number;
}
const EditTray: React.FC<Props> = ({ owner, postID }: Props) => {
    const token = useAppSelector((state) => state.token);
    const posts = useAppSelector((state) => state.posts);
    const [selectedID, setSelectedID] = React.useState(0);
    const [selectedModalID, setSelectedModalID] = React.useState(0);
    const { width } = useWindowDimensions();

    const dispatch = useAppDispatch();
    const handleThumbUp = () => {
        dispatch(addPostLike(postID, token.Token));
    };
    const [open, setOpen] = React.useState(false);
    const [openModal, setOpenModal] = React.useState(false);
    const handleDelete = () => {
        setOpen(true);
        setSelectedID(postID);
    };
    const handleEdit = () => {
        setOpenModal(true);
        setSelectedModalID(postID);
    };

    const modalStyle = {
        theme: { color: "#fff" },
        height: "70vh + 10vw",
        position: "absolute",
        left: "50%",
        top: "10%",
        overflow: "scroll",
    };

    if (owner === 2) {
        return (
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
                <Dialog open={open} id={selectedID} handleClose={() => setOpen(false)} />
                <Modal
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    sx={
                        width < 900
                            ? { ...modalStyle, width: "96vw", marginLeft: "-48vw", marginRight: "-48vw" }
                            : { ...modalStyle, width: "46vw", marginLeft: "-23vw", marginRight: "-23vw" }
                    }
                >
                    <Box>
                        <CreatePost
                            handleClose={() => setOpenModal(false)}
                            post={posts.find((post) => post.ID === selectedModalID) || ({} as Post)}
                        />
                    </Box>
                </Modal>
                <IconButton onClick={handleThumbUp}>
                    <ThumbUpIcon />
                </IconButton>
                <IconButton onClick={handleDelete}>
                    <DeleteIcon />
                </IconButton>
                <IconButton onClick={handleEdit}>
                    <EditIcon />
                </IconButton>
            </div>
        );
    } else if (owner === 1) {
        return (
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
                <IconButton onClick={handleThumbUp}>
                    <ThumbUpIcon />
                </IconButton>
            </div>
        );
    } else {
        return null;
    }
};

export default EditTray;
