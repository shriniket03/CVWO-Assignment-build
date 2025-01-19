import "../App.css";
import PostUI from "./PostUI";
import CreatePost from "../pages/CreatePost";
import { type Post } from "../types/Post";
import { sortPostsLikes, sortPostDate } from "../store";
import { useAppDispatch, useAppSelector, useWindowDimensions } from "../hooks";
import { List, Fab, Modal, Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React from "react";

const BasicThreadList: React.FC = () => {
    const dispatch = useAppDispatch();
    const [sort, setSort] = React.useState("1");

    const posts = useAppSelector((state) => state.posts);
    const token = useAppSelector((state) => state.token);
    const search = useAppSelector((state) => state.filter);
    const { width } = useWindowDimensions();

    const [open, setOpen] = React.useState(false);
    const handleClose = () => setOpen(false);
    const handleOpen = () => setOpen(true);

    const handleChange = (event: unknown) => {
        (event as React.ChangeEvent<HTMLSelectElement>).preventDefault();
        setSort((event as React.ChangeEvent<HTMLSelectElement>).target.value as string);
        if ((event as React.ChangeEvent<HTMLSelectElement>).target.value === "0") {
            dispatch(sortPostDate());
        } else {
            dispatch(sortPostsLikes());
        }
    };

    const modalStyle = {
        theme: { color: "#fff" },
        height: "70vh + 10vw",
        position: "absolute",
        left: "50%",
        top: "10%",
        overflow: "scroll",
    };

    return (
        <div>
            <FormControl style={{ marginRight: 20, float: "right", width: 120 }}>
                <InputLabel id="selectLabel">Sort By</InputLabel>
                <Select labelId="selectorLabel" id="selectField" value={sort} label="Sort By" onChange={handleChange}>
                    <MenuItem value={"1"}>Likes</MenuItem>
                    <MenuItem value={"0"}>Newest</MenuItem>
                </Select>
            </FormControl>
            <div style={{ width: "100vw", margin: "auto", textAlign: "center", overflowY: "auto" }}>
                <List>
                    {posts
                        .filter(
                            (post) =>
                                post.Tag.toLowerCase().includes(search.toLowerCase()) ||
                                post.Content.toLowerCase().includes(search.toLowerCase()),
                        )
                        .map((post: Post) => (
                            <PostUI {...post} key={post.ID} />
                        ))}
                </List>
                <Modal
                    open={open}
                    onClose={handleClose}
                    sx={
                        width < 900
                            ? { ...modalStyle, width: "96vw", marginLeft: "-48vw", marginRight: "-48vw" }
                            : { ...modalStyle, width: "46vw", marginLeft: "-23vw", marginRight: "-23vw" }
                    }
                >
                    <Box>
                        <CreatePost handleClose={handleClose} post={{} as Post} />
                    </Box>
                </Modal>
                {token.Valid ? (
                    <div style={{ justifyContent: "right", marginBottom: 25, float: "right", marginRight: 40 }}>
                        <Fab color="primary" aria-label="add" sx={{ position: "relative" }} onClick={handleOpen}>
                            <AddIcon />
                        </Fab>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default BasicThreadList;
