import { useAppDispatch, useAppSelector } from "../hooks";
import { setSuccessMessage, validateToken, logOut } from "../store";
import { verifyToken } from "../services/users";
import React from "react";
import { Button } from "@mui/material";

type Props = {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setSelected: React.Dispatch<React.SetStateAction<boolean>>;
};

const LoggedIn: React.FC<Props> = ({ setOpen, setSelected }: Props) => {
    const dispatch = useAppDispatch();
    const token = useAppSelector((state) => state.token);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setOpen(true);
        setSelected(false);
    };
    React.useEffect(() => {
        if (token.Token != "") {
            verifyToken(token.Token)
                .then(() => dispatch(validateToken(true)))
                .catch(() => dispatch(validateToken(false)));
        }
    }, [validateToken, token]);
    if (token.Valid) {
        return (
            <em>
                <Button
                    color="inherit"
                    sx={{ margin: 2 }}
                    onClick={async () => {
                        window.localStorage.removeItem("username");
                        window.localStorage.removeItem("token");
                        dispatch(logOut());
                        await dispatch(setSuccessMessage(`Successfully logged out`));
                    }}
                >
                    Logout
                </Button>
                Logged in as {token.Username}{" "}
            </em>
        );
    } else {
        return (
            <div>
                <Button color="inherit" onClick={() => setOpen(true)}>
                    Login
                </Button>
                <Button color="inherit" onClick={handleClick}>
                    Sign Up
                </Button>
            </div>
        );
    }
};

export default LoggedIn;
