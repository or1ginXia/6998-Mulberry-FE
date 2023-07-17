import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {useHistory} from "react-router-dom";
// import {COLORS} from "./shared";
// import {Link} from "react-router-dom";

const LogoutBase = styled.div`
  display: inline-grid;
  justify-content: center;
  grid-area: main;
`;

export const LogOutPage = ({logOut}) => {
    const history = useHistory();
    useEffect(() => {
        logOut();
        setTimeout(() => {
            history.push("/");
        }, 2000);
    }, []);
    return (
        <LogoutBase>
            <h2>You have been logged out. Redirecting...</h2>
        </LogoutBase>
    );
};
