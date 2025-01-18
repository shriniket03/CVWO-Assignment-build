import { useAppDispatch, useAppSelector } from "../hooks";
import { closeMessage } from "../store";
import { type Notification } from "../types/Notification";
import { Alert, IconButton, Collapse } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";

const NotifComponent: React.FC = () => {
    const dispatch = useAppDispatch();
    type Severity = "error" | "success" | "info" | "warning" | undefined;
    let style: Severity = undefined;
    const notification: Notification = useAppSelector((state) => state.notifications);
    if (notification.type === "error") {
        style = "error";
    } else {
        style = "success";
    }
    React.useEffect(() => {
        const timer = setTimeout(() => dispatch(closeMessage()), 5000);
        return () => {
            clearTimeout(timer);
        };
    });

    return (
        <div style={{ margin: 10, marginBottom: 0 }}>
            {notification.msg && (
                <Collapse in={notification.open}>
                    <Alert
                        severity={style}
                        variant="filled"
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    dispatch(closeMessage());
                                }}
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                        sx={{ mb: 2, borderRadius: 5 }}
                    >
                        {notification.msg}
                    </Alert>
                </Collapse>
            )}
        </div>
    );
};

export default NotifComponent;
