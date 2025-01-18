import Home from "./pages/Home";
import PostDetails from "./pages/PostDetails";
// import BasicThreadView from "./unused/BasicThreadView";
// import StyledThreadView from "./unused/StyledThreadView";
import { setSuccessMessage, sortPostsLikes, setErrorMessage, initialisePosts } from "./store";
import { useAppDispatch } from "./hooks";
import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { blue, orange } from "@mui/material/colors";

const theme = createTheme({
    palette: {
        primary: blue,
        secondary: orange,
    },
});

const App: React.FC = () => {
    const dispatch = useAppDispatch();
    React.useEffect(() => {
        dispatch(initialisePosts())
            .then(() => {
                dispatch(setSuccessMessage("Successfully Listed Posts"));
                dispatch(sortPostsLikes());
            })
            .catch((err) => dispatch(setErrorMessage((err as Error).message)));
    }, []);
    return (
        <div className="App">
            <ThemeProvider theme={theme}>
                <BrowserRouter>
                    <Routes>
                        {/* <Route path="/thread/1" element={<BasicThreadView />} />
                        <Route path="/thread/1/styled" element={<StyledThreadView />} /> */}
                        <Route path="/" element={<Home />} />
                        <Route path="/post/:id" element={<PostDetails />} />
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </div>
    );
};

export default App;
