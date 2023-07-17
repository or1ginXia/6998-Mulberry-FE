import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {COLORS, ErrorMessage, getStoredUser} from "./shared";
import {Link, useHistory} from "react-router-dom";

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
  width: 70%;
  background: ${COLORS.GREY_T};
  border: 3px solid #000000;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  margin-top: 40px;
  margin-bottom: 40px;
  font-weight: 600;
  font-size: 20px;
  cursor: pointer;
`;

export const SignIn = ({login}) => {
    const [userEmail, setUserEmail] = useState("");
    const [userPass, setUserPass] = useState("");
    const [error, setError] = useState("");
    const history = useHistory();

    const onSubmit = async (ev) => {
        ev.preventDefault();
        setError("");
        try {
            const res = await login(userEmail, userPass);
            if (!res) {
                history.push("/compprof");
            } else {
                history.push("/");
            }
        } catch (error) {
            setError("Email or password mismatch");
        }
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
                <SignInText>Sign in</SignInText>
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
                               placeholder={"Password"}
                               value={userPass}
                               onChange={(ev) => setUserPass(ev.target.value)}/>
                    <FormButton id="submitBtn" onClick={onSubmit}>
                        Login
                    </FormButton>
                </FormBase>
            </FormContainer>
            <div style={{
                width: "100%",
                textAlign: "center",
                fontWeight: 600,
                fontSize: "17px",
                marginTop: "20px",
            }}>
                New to Mulberry?
            </div>
            <Link style={{
                width: "100%",
                lineHeight: "40px",
                textAlign: "center",
                background: COLORS.ORANGE_T,
                fontWeight: 600,
                fontSize: "17px",
                marginTop: "20px",
                border: "3px solid #000000",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                cursor: "pointer",
                textDecoration: "none"
            }} to="/signup">
                Create your account here
            </Link>
        </HomeBase>
    );
};
