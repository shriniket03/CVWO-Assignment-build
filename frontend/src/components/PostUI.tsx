import EditTray from "./EditTray";
import { type Post } from "../types/Post";
import { useAppSelector } from "../hooks";
import React from "react";
import { Box, Divider, ListItem, ListItemAvatar, ListItemText, Avatar, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const PostUI: React.FC<Post> = (props: Post) => {
    const mid = Math.floor(props.AuthName.length / 2);
    const newStr = `${props.AuthName.slice(0, mid)} ${props.AuthName.slice(mid)} `;
    const token = useAppSelector((state) => state.token);
    return (
        <Box>
            <Divider variant="inset" component="li" />
            <ListItem alignItems="flex-start">
                <ListItemAvatar>
                    <Avatar {...stringAvatar(newStr)} />
                </ListItemAvatar>
                <ListItemText
                    primary={<Link to={`/post/${props.ID}`}>{props.Tag}</Link>}
                    secondary={
                        <React.Fragment>
                            <Typography
                                component="span"
                                variant="body2"
                                sx={{ color: "text.primary", display: "inline" }}
                            >
                                {props.AuthName}
                            </Typography>
                            {` - ${props.Content.split(" ").slice(0, 100).join(" ")} ${
                                props.Content.split(" ").length > 100 ? "..." : ""
                            }`}
                        </React.Fragment>
                    }
                    sx={{ width: 500, marginRight: 10, textAlign: "justify" }}
                />
                <div style={{ marginRight: 10, margin: 5, width: 120 }}>
                    {props.Likes} likes <br></br>
                    <em style={{ color: "GrayText", fontSize: 12 }}>
                        {new Date(props.Time * 1000).toLocaleString("en-GB")}
                    </em>
                    <EditTray
                        owner={token.Valid ? (token.Username === props.AuthUsername ? 2 : 1) : 0}
                        postID={props.ID}
                    />
                </div>
            </ListItem>
        </Box>
    );
};

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

export default PostUI;
