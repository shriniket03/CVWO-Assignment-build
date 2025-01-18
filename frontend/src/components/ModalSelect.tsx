import LoginForm from "../pages/LoginForm";
import SignUpForm from "../pages/SignUpForm";
import React from "react";

type Props = {
    selected: boolean;
    setClose: React.Dispatch<React.SetStateAction<boolean>>;
    setSelected: React.Dispatch<React.SetStateAction<boolean>>;
};
const ModalSelect: React.FC<Props> = ({ selected, setClose, setSelected }: Props) => {
    if (selected) {
        return <LoginForm setClose={setClose} setSelected={setSelected} />;
    } else {
        return <SignUpForm setClose={setClose} setSelected={setSelected} />;
    }
};

export default ModalSelect;
