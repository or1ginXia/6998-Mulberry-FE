import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {useHistory} from "react-router-dom";
// import {COLORS} from "./shared";
// import {Link} from "react-router-dom";

const ExpiredBase = styled.div`
  display: inline-grid;
  justify-content: center;
  grid-area: main;
`;

export const ExpiredPage = ({logOut}) => {
    const history = useHistory();
    useEffect(() => {
        logOut();
        setTimeout(() => {
            history.push("/signin");
        }, 2000);
    }, []);
    return (
        <ExpiredBase>
            <h2>Session expired. Please sign in again...</h2>
        </ExpiredBase>
    );
};
