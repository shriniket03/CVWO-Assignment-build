import { loginUser } from "../services/users";
import { useAppDispatch } from "../hooks";
import { setSuccessMessage, initToken } from "../store";
import React from "react";
import {
    Box,
    FormControl,
    OutlinedInput,
    InputAdornment,
    IconButton,
    TextField,
    InputLabel,
    Button,
    FormHelperText,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
type Props = {
    setClose: React.Dispatch<React.SetStateAction<boolean>>;
    setSelected: React.Dispatch<React.SetStateAction<boolean>>;
};

const LoginForm: React.FC<Props> = ({ setClose, setSelected }: Props) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [userValid, setUserValid] = React.useState("");
    const [passValid, setPassValid] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const dispatch = useAppDispatch();

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const token = await loginUser({ username, password });
            window.localStorage.setItem("token", token.Token);
            window.localStorage.setItem("name", token.Username);
            dispatch(initToken({ Username: token.Username, Token: token.Token, Valid: true }));
            await dispatch(setSuccessMessage(`Successfully logged in as ${token.Username}`));
            setClose(false);
        } catch (err) {
            setUserValid((err as Error).message);
            setPassValid((err as Error).message);
        }
    };

    const handleChooseSignUp = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        setSelected(false);
    };

    const handleUserChange = (event: React.ChangeEvent) => {
        event.preventDefault();
        setUsername((event.target as HTMLInputElement).value);
        setUserValid("");
    };

    const handlePasswordChange = (event: React.ChangeEvent) => {
        event.preventDefault();
        setPassword((event.target as HTMLInputElement).value);
        setPassValid("");
    };

    return (
        <Box
            style={{
                backgroundColor: "white",
                padding: 50,
                textAlign: "center",
                width: "400px",
                height: "400px",
            }}
        >
            <h2>
                Login to Contribute to the <br></br>Gossip Community
            </h2>
            <br></br>
            <FormControl>
                <TextField
                    id="username"
                    label="Username"
                    variant="outlined"
                    sx={{ marginBottom: 2 }}
                    value={username}
                    onChange={handleUserChange}
                    error={userValid !== ""}
                    helperText={userValid}
                />
                <FormControl>
                    <InputLabel htmlFor="passwordForm">Password</InputLabel>
                    <OutlinedInput
                        id="passwordForm"
                        type={showPassword ? "text" : "password"}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label={showPassword ? "hide the password" : "display the password"}
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    onMouseUp={handleMouseUpPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Password"
                        value={password}
                        onChange={handlePasswordChange}
                        error={passValid !== ""}
                    />
                    <FormHelperText error>{passValid}</FormHelperText>
                </FormControl>
                <Button variant="contained" onClick={handleLogin} sx={{ marginTop: 2 }}>
                    Login
                </Button>
                <em style={{ marginTop: 20 }}>
                    {"Don't have an account? "}{" "}
                    <a href="#" onClick={handleChooseSignUp}>
                        Sign Up Here!
                    </a>
                </em>
            </FormControl>
        </Box>
    );
};

export default LoginForm;
