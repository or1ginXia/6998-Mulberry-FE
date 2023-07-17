import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {COLORS, APIGLink, ErrorMessage, encryptPassword, getStoredUser} from "./shared";
import {Link, useHistory} from "react-router-dom";
import axios from "axios";

const HomeBase = styled.div`
  display: inline-grid;
  justify-content: center;
  grid-area: main;
`;

const Title = styled.div`
  width: 100%;
  text-align: center;
  font-weight: 700;
  font-size: 48px;
  color: ${COLORS.PURPLE_T};
  margin-top: 20px;
`;

const FormContainer = styled.div`
  display: inline-grid;
  min-width: 400px;
  justify-items: left;
  justify-content: left;
  box-sizing: border-box;
  border: 3px solid #000000;
  margin-top: 20px;
`;

const SignInText = styled.div`
  margin-top: 20px;
  margin-left: 30px;
  font-weight: 500;
  font-size: 40px;
  min-width: 100%;
`;

const FormBase = styled.form`
  display: inline-grid;
  margin-top: 20px;
  margin-left: 30px;
  width: 100%;
`;

const FormLabel = styled.label`
  margin-top: 20px;
  font-weight: 500;
  font-size: 24px;
`;

const FormInput = styled.input`
  display: block;
  width: 100%;
  margin-top: 2px;
  height: 30px;
  border: 3px solid #000000;
  font-weight: 400;
  font-size: 16px;
`;

const FormButton = styled.button`
  //width: 70%;
  background: ${COLORS.ORANGE_T};
  border: 3px solid #000000;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  margin-top: 40px;
  margin-bottom: 40px;
  font-weight: 600;
  font-size: 20px;
  cursor: pointer;
`;

export const SignUp = () => {
    const [userEmail, setUserEmail] = useState("");
    const [userPass, setUserPass] = useState("");
    const [passConfirm, setPassConfirm] = useState("");
    const [error, setError] = useState("");

    const history = useHistory();

    const validateEmail = (email) => {
        return email && email.match(
            /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/gm
        );
    };

    const onSubmit = async (ev) => {
        ev.preventDefault();

        if (!validateEmail(userEmail)) {
            setError("Malformed email address");
            return;
        }

        if (passConfirm !== userPass) {
            setError("Password mismatch");
            return;
        }
        setError("");

        axios.post(
            APIGLink + "/user/signup",
            {
                email: userEmail,
                password: encryptPassword(userPass)
            }
        ).then((resp) => {
            if (resp.data["status"] === "fail") {
                setError(resp.data["message"]);
            } else {
                history.push("/signin");
            }
        }).catch((error) => {
            setError(`Signup error`);
        });
    };

    useEffect(() => {
        if (getStoredUser()) {
            history.push("/");
            return;
        }
        document.getElementById("email").focus();
    }, []);

    return (
        <HomeBase>
            <Title>Mulberry</Title>
            <FormContainer>
                <SignInText>Sign-up</SignInText>
                <ErrorMessage msg={error} hide={error === ""}/>
                <FormBase>
                    <FormLabel htmlFor={"email"}>Email</FormLabel>
                    <FormInput id={"email"}
                               name={"email"}
                               type={"email"}
                               placeholder={"Email"}
                               value={userEmail}
                               onChange={(ev) => setUserEmail(ev.target.value.toLowerCase())}/>

                    <FormLabel htmlFor={"password"}>Password</FormLabel>
                    <FormInput id={"password"}
                               name={"password"}
                               type={"password"}
                               placeholder={"Enter Password"}
                               value={userPass}
                               onChange={(ev) => setUserPass(ev.target.value)}/>

                    <FormLabel htmlFor={"password2"}>Confirm Password</FormLabel>
                    <FormInput id={"password2"}
                               name={"password2"}
                               type={"password"}
                               placeholder={"Re-enter Password"}
                               value={passConfirm}
                               onChange={(ev) => setPassConfirm(ev.target.value)}/>
                    <FormButton id="submitBtn" onClick={onSubmit}>
                        Create your account
                    </FormButton>
                </FormBase>
            </FormContainer>
            <div style={{display: "flex", textAlign: "center", marginTop: "7px"}}>
                <div style={{flex: 1}}>
                    Already have an account?
                </div>
                <Link style={{flex: 1, textDecoration: "none"}} to="/signin">
                    Sign in
                </Link>
            </div>

        </HomeBase>
    );
};
