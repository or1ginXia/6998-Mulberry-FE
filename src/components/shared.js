// import React from "react";
// import PropTypes from "prop-types"; // for prop type checking
// import styled from "styled-components";

import styled from "styled-components";
import sha256 from "crypto-js/sha256"

export const COLORS = {
    PURPLE_T: "#A459D1",
    PINK_T: "#F5EAEA",
    RED_T: "#F16767",
    ORANGE_T: "#FFB84C",
    WHITE_T: "#FFFFFF",
    GREY_T: "#D9D9D9",
    BROWN_T: "#B3A0A0",
    BLUE_T: "#A0D3F8"
};

const ErrorBase = styled.div`
  grid-column: 1 / 3;
  color: red;
  display: flex;
  justify-content: center;
  padding: 1em;
  min-height: 1.2em;
`;

export const ErrorMessage = ({msg = "", hide = false}) => {
    return (
        <ErrorBase style={{display: hide ? "none" : "inherit"}}>{msg}</ErrorBase>
    );
};

export const encryptPassword = (pass) => {
    return sha256(pass).toString();
};

export const defaultUser = {
    email: "",
    status: "DEACTIVE",
    name: "",
    photo: "",
    birthday: "",
    gender: "male",
    location: "",
    career: "",
    height: "",
    created_ts: "",
    email_verified: "",
    interest1: "",
    interest2: "",
    interest3: "",
    prompt1: "Easy-going",
    prompt2: "Thai",
    prompt3: "Science",
    token: ""
};

export const setStoredUser = (user) => {
    // const now = new Date()
    const tmp = {...user};
    // tmp.expiry = now.getTime() + 3.6e6; // an hour
    localStorage.setItem("user", JSON.stringify(tmp))
}

export const getStoredUser = () => {
    // const storedUser = localStorage.getItem("user");
    // if (storedUser) {
    //     const now = new Date();
    //     if (now.getTime() <= storedUser.expiry) {
    //         return JSON.parse(storedUser)
    //     }
    // }
    // localStorage.removeItem("user");
    // return null;

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
        return null
    }
    return JSON.parse(storedUser);
}

export const capString = (str) => {
    if (!str) return;
    let words = str.split(' ');
    for (let i = 0; i < words.length; i++) {
        let word = words[i];
        words[i] = word.charAt(0).toUpperCase() + word.slice(1);
    }
    return words.join(' ');
}

export const APIGLink = "https://6h6jyd2v10.execute-api.us-east-1.amazonaws.com/v1";
export const S3Upload = "https://mulberry-photo.s3-external-1.amazonaws.com";
export const S3ImgUrl = "https://mulberry-photo.s3.amazonaws.com";


