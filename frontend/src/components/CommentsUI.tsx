import { type Comment } from "../types/Comments";
import { useAppDispatch, useAppSelector } from "../hooks";
import { deleteComment } from "../store";
import React from "react";
import { Box, Divider, ListItem, ListItemAvatar, ListItemText, Avatar, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const CommentsUI: React.FC<Comment> = (props: Comment) => {
    const mid = Math.floor(props.AuthName.length / 2);
    const newStr = `${props.AuthName.slice(0, mid)} ${props.AuthName.slice(mid)} `;
    const dispatch = useAppDispatch();
    const token = useAppSelector((state) => state.token);

    const handleDelete = (id: number) => {
        dispatch(deleteComment(id, token.Token));
    };

    return (
        <Box>
            <Divider variant="inset" component="li" />
            <ListItem alignItems="center">
                <ListItemAvatar>
                    <Avatar {...stringAvatar(newStr)} />
                </ListItemAvatar>
                <ListItemText secondary={props.Content} sx={{ width: 500, marginRight: 10, textAlign: "justify" }} />
                <div style={{ marginRight: 10, margin: 5, width: 200 }}>
                    {token.Valid ? (
                        token.Username === props.AuthUsername ? (
                            <IconButton onClick={() => handleDelete(props.ID)}>
                                <DeleteIcon />
                            </IconButton>
                        ) : null
                    ) : null}
                    <em style={{ color: "GrayText", fontSize: 12 }}>
                        {new Date(props.Time * 1000).toLocaleString("en-GB")}
                    </em>
                </div>
            </ListItem>
        </Box>
    );
};
// onClick={handleDelete}>
function stringToColor(string: string) {
    let hash = 0;
    let i;
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
}

function stringAvatar(name: string) {
    return {
        sx: {
            bgcolor: stringToColor(name.toUpperCase()),
        },
        children: `${name.toUpperCase().split(" ")[0][0]}${name.toUpperCase().split(" ")[1][0]}`,
    };
}

export default CommentsUI;
