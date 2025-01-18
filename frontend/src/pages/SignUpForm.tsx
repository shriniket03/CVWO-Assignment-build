import { signUpUser } from "../services/users";
import { setSuccessMessage } from "../store";
import { useAppDispatch } from "../hooks";
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

const SignUpForm: React.FC<Props> = ({ setSelected, setClose }: Props) => {
    const dispatch = useAppDispatch();
    const [showPassword, setShowPassword] = React.useState(false);
    const [userValid, setUserValid] = React.useState("");
    const [passValid, setPassValid] = React.useState("");
    const [nameValid, setNameValid] = React.useState("");

    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [name, setName] = React.useState("");
    const [confirmPass, setConfirmPass] = React.useState("");

    const handleSignUpAction = async (event: React.FormEvent) => {
        event.preventDefault();
        if (password !== confirmPass) {
            setPassValid("Passwords did not match. Please Try Again");
        } else {
            try {
                const res = await signUpUser({ username, password, name });
                await dispatch(setSuccessMessage(`Created Account with Username ${res}. You may login now.`));
                setClose(false);
            } catch (err) {
                try {
                    const obj = JSON.parse((err as Error).message);
                    if (obj.Username) {
                        setUserValid(obj.Username);
                    }
                    if (obj.Name) {
                        setNameValid(obj.Name);
                    }
                    if (obj.Password) {
                        setPassValid(obj.Password);
                    }
                    if (!(obj.Username || obj.Name || obj.Password)) {
                        setUserValid((err as Error).message);
                    }
                } catch (e) {
                    setUserValid((err as Error).message);
                }
            }
        }
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleChooseLogin = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        setSelected(true);
    };

    const handleUserChange = (event: React.ChangeEvent) => {
        event.preventDefault();
        setUsername((event.target as HTMLInputElement).value);
        setUserValid("");
    };

    const handleNameChange = (event: React.ChangeEvent) => {
        event.preventDefault();
        setName((event.target as HTMLInputElement).value);
        setNameValid("");
    };

    const handleConfirmPassChange = (event: React.ChangeEvent) => {
        event.preventDefault();
        setConfirmPass((event.target as HTMLInputElement).value);
        setPassValid("");
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
                height: "500px",
                overflow: "scroll",
            }}
        >
            <h2>
                Join the Gossip <br></br> Community Today!
            </h2>
            <br></br>
            <FormControl>
                <TextField
                    id="username"
                    label="Choose Username"
                    variant="outlined"
                    sx={{ marginBottom: 2 }}
                    value={username}
                    onChange={handleUserChange}
                    error={userValid !== ""}
                    helperText={userValid}
                />
                <TextField
                    id="name"
                    label="Set Name"
                    variant="outlined"
                    sx={{ marginBottom: 2 }}
                    value={name}
                    onChange={handleNameChange}
                    error={nameValid !== ""}
                    helperText={nameValid}
                />
                <FormControl>
                    <InputLabel htmlFor="passwordForm">Set Password</InputLabel>
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
                        label="Set Password"
                        value={password}
                        onChange={handlePasswordChange}
                        error={passValid !== ""}
                    />
                    <FormHelperText error>{passValid}</FormHelperText>
                </FormControl>
                <FormControl sx={{ marginTop: 2 }}>
                    <InputLabel htmlFor="confirmPasswordForm">Confirm Password</InputLabel>
                    <OutlinedInput
                        id="confirmPasswordForm"
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
                        label="Confirm Password"
                        value={confirmPass}
                        onChange={handleConfirmPassChange}
                        error={passValid !== ""}
                    />
                    <FormHelperText error>{passValid}</FormHelperText>
                </FormControl>
                <Button variant="contained" sx={{ marginTop: 2 }} onClick={handleSignUpAction}>
                    Sign Up
                </Button>
                <em style={{ marginTop: 20 }}>
                    {"Already Have An Account? "}{" "}
                    <a href="#" onClick={handleChooseLogin}>
                        Login Here!
                    </a>
                </em>
            </FormControl>
        </Box>
    );
};

export default SignUpForm;
