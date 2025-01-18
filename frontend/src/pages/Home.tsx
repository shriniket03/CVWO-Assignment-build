import { useAppDispatch } from "../hooks";
import { initToken } from "../store";
import BasicThreadList from "../components/BasicThreadList";
import NotifComponent from "../components/Notification";
import Menu from "../components/Menu";
import React from "react";

const Home: React.FC = () => {
    const dispatch = useAppDispatch();
    React.useEffect(() => {
        const tok = window.localStorage.getItem("token") || "";
        const username = window.localStorage.getItem("name") || "";
        dispatch(initToken({ Token: tok, Username: username, Valid: false }));
    }, []);
    return (
        <>
            <Menu page={0} />
            <NotifComponent />
            <br />
            <BasicThreadList />
        </>
    );
};

export default Home;
