import LoggedIn from "./LoggedIn";
import ModalSelect from "./ModalSelect";
import { useAppDispatch, useAppSelector } from "../hooks";
import { initToken, modifyFilter } from "../store";
import { useNavigate } from "react-router-dom";
import { styled, alpha } from "@mui/material/styles";
import { Box, AppBar, Toolbar, Typography, Modal, InputBase, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React from "react";

type Props = {
    page: number;
};
const Menu: React.FC<Props> = ({ page }: Props) => {
    const [open, setOpen] = React.useState(false);
    const [selected, setSelected] = React.useState(true);

    const search = useAppSelector((state) => state.filter.search);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleOpen = () => {
        setSelected(true);
        setOpen(true);
    };
    const handleClose = () => setOpen(false);
    const handleSearch = (event: React.ChangeEvent) => {
        event.preventDefault();
        dispatch(modifyFilter((event.target as HTMLInputElement).value));
    };

    const menuProps = { setOpen: handleOpen, setSelected };

    React.useEffect(() => {
        const tok = window.localStorage.getItem("token") || "";
        const user = window.localStorage.getItem("name") || "";
        dispatch(initToken({ Token: tok, Username: user, Valid: false }));
    }, []);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Modal
                open={open}
                onClose={handleClose}
                sx={{
                    theme: { color: "#fff" },
                    width: "400px",
                    height: "400px",
                    position: "absolute",
                    left: "50%",
                    top: "15%",
                    marginLeft: "-250px",
                    marginRight: "-250px",
                }}
            >
                <Box>
                    <ModalSelect selected={selected} setClose={setOpen} setSelected={setSelected} />
                </Box>
            </Modal>
            <AppBar position="static">
                <Toolbar>
                    {page === 0 ? (
                        <LoggedIn {...menuProps} />
                    ) : (
                        <Button color="inherit" onClick={() => navigate("/")}>
                            Back
                        </Button>
                    )}
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, position: "static" }}>
                        Gossip Forum on Go & Typescript
                    </Typography>
                    {page === 0 ? (
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search…"
                                inputProps={{ "aria-label": "search", value: search }}
                                onChange={handleSearch}
                            />
                        </Search>
                    ) : (
                        <LoggedIn {...menuProps} />
                    )}
                </Toolbar>
            </AppBar>
        </Box>
    );
};

const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.1),
    "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.2),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(1),
        width: "auto",
    },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    width: "100%",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create("width"),
        [theme.breakpoints.up("sm")]: {
            width: "20ch",
            "&:focus": {
                width: "40ch",
            },
        },
    },
}));

export default Menu;
