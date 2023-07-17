import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {COLORS, APIGLink, ErrorMessage, getStoredUser, encryptPassword} from "./shared";
import {Link, useHistory} from "react-router-dom";
import axios from "axios";

const ChangePassBase = styled.div`
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
  max-width: 350px;
  margin-top: 2px;
  height: 30px;
  border: 3px solid #000000;
  font-weight: 400;
  font-size: 16px;
`;

const FormButton = styled.button`
  max-width: 350px;
  background: ${COLORS.ORANGE_T};
  border: 3px solid #000000;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  margin-top: 40px;
  margin-bottom: 40px;
  font-weight: 600;
  font-size: 20px;
  cursor: pointer;
`;

export const ChangePassword = () => {
    const [userEmail, setUserEmail] = useState("");
    const [userPass, setUserPass] = useState("");
    const [passConfirm, setPassConfirm] = useState("");
    const [error, setError] = useState("");
    const user = getStoredUser();

    const history = useHistory();

    const validateEmail = (email) => {
        return email && email === user.email.toLowerCase() && email.match(
            /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/gm
        );
    };

    const onSubmit = async (ev) => {
        ev.preventDefault();

        if (!validateEmail(userEmail)) {
            setError("Bad email address");
            return;
        }

        if (passConfirm !== userPass) {
            setError("Password mismatch");
            return;
        }
        setError("");

        const encryptedPass = encryptPassword(userPass);
        axios.put(
            APIGLink + "/user/password",
            {
                email: userEmail,
                password: encryptedPass
            },
            {
                headers: {
                    Authorization: user.token
                }
            }
        ).then((resp) => {
            console.log(`Password change complete`);
            history.push("/");
        }).catch((error) => {
            if (error.response.status === 403) {
                history.push("/expired");
                return;
            }
            setError(`Password change error`);
        });
    };

    useEffect(() => {
        if (!user) {
            history.push("/signin");
            return;
        }

        document.getElementById("email").focus();
    }, []);

    return (
        <ChangePassBase>
            <Title>Mulberry</Title>
            <FormContainer>
                <SignInText>Change Your Password</SignInText>
                <ErrorMessage msg={error} hide={error === ""}/>
                <FormBase>
                    <FormLabel htmlFor={"email"}>Enter your email</FormLabel>
                    <FormInput id={"email"}
                               name={"email"}
                               type={"email"}
                               placeholder={"Email"}
                               value={userEmail}
                               onChange={(ev) => setUserEmail(ev.target.value.toLowerCase())}/>

                    <FormLabel htmlFor={"password"}>Enter your new password</FormLabel>
                    <FormInput id={"password"}
                               name={"password"}
                               type={"password"}
                               placeholder={"Enter Password"}
                               value={userPass}
                               onChange={(ev) => setUserPass(ev.target.value)}/>

                    <FormLabel htmlFor={"password2"}>Confirm your new password</FormLabel>
                    <FormInput id={"password2"}
                               name={"password2"}
                               type={"password"}
                               placeholder={"Re-enter Password"}
                               value={passConfirm}
                               onChange={(ev) => setPassConfirm(ev.target.value)}/>
                    <FormButton id="submitBtn" onClick={onSubmit}>
                        Finish
                    </FormButton>
                </FormBase>
            </FormContainer>
        </ChangePassBase>
    );
};
