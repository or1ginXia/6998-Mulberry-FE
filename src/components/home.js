import React from "react";
import styled from "styled-components";
import {COLORS} from "./shared";
import {Link} from "react-router-dom";

const HomeBase = styled.div`
  display: inline-grid;
  justify-content: center;
  //align-content: center;
  justify-items: center;
  grid-area: main;
`;

const TopBox = styled.div`
  display: flex;
  justify-content: right;
  background: ${COLORS.PINK_T};
  border-radius: 30px;
  width: 70%;
  margin-top: 50px;
`;

const ThreeLines = styled.div`
  flex: 2;
  padding-top: 20px;
  padding-left: 60px;
`;

const Title = styled.div`
  color: ${COLORS.PURPLE_T};
  font-size: 48px;
  text-decoration: underline;
  font-weight: 700;
`;

const Prompts = styled.div`
  color: ${COLORS.RED_T};
  font-size: 32px;
  font-weight: 700;
  margin-top: 30px;
  margin-bottom: 30px;
`;

const PictureContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-right: 60px;
  max-height: 270px;
  margin-left: 20px
`;

const PictureDisplay = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

const BotBox = styled.div`
  background: ${COLORS.WHITE_T};
  border: 1px solid ${COLORS.ORANGE_T};
  border-radius: 30px;
  display: flex;
  width: 70%;
  margin-top: 60px;
  min-height: 300px;
`;

const BotRight = styled.div`
  flex: 2;
  margin-top: 20px;
  margin-left: 60px;
  margin-right: 100px;
`;

const BotPrompt = styled.div`
  font-weight: 700;
  font-size: 32px;
  color: ${COLORS.RED_T};
  margin-top: 30px;
`;

const DefaultBot = styled.div`
  font-weight: 700;
  font-size: 32px;
  color: ${COLORS.PURPLE_T};
  margin-top: 50px;
`;

const LoggedInBot = styled.div`
  & > div > p {
    text-align: center;
    font-weight: 700;
    font-size: 32px;
    line-height: 39px;
    color: ${COLORS.PURPLE_T};
  }

  & > div > a {
    font-weight: 700;
    font-size: 24px;
    line-height: 29px;
    color: ${COLORS.PURPLE_T};
    margin-right: 10px;
  }
`;

export const Home = ({username}) => {
    const isLoggedIn = username !== "";
    let tmpIdx = username.indexOf(' ');
    if (tmpIdx === -1)
        tmpIdx = username.length;
    const firstName = username === "" ? "": username.substring(0, tmpIdx);
    return (
        <HomeBase>
            <TopBox>
                <ThreeLines>
                    <Title>Mulberry</Title>
                    <Prompts>Meet your soulmate now at Mulberry!</Prompts>
                    <Prompts>We help you find your perfect match</Prompts>
                </ThreeLines>
                <PictureContainer>
                    <PictureDisplay src={require("../imgs/main_pic_1.png")}/>
                </PictureContainer>
            </TopBox>
            <BotBox>
                <PictureContainer>
                    <PictureDisplay src={require("../imgs/main_pic_2.jpg")}
                                    style={{maxWidth: "400px"}}/>
                </PictureContainer>
                <BotRight>
                    <BotPrompt>Find your other half now in just a few minutes</BotPrompt>
                    {
                        isLoggedIn ? (
                            <LoggedInBot>
                                <div><p>Hello, {firstName}</p></div>
                                <div style={{display: "flex", justifyContent: "space-between"}}>
                                    <Link to="/matches">Matches</Link>
                                    <Link to="/chatlist">Chat</Link>
                                    <Link to="/profile">Profile</Link>
                                </div>
                            </LoggedInBot>
                        ) : (<DefaultBot>
                            <Link to="/signin">Sign-in</Link>
                            <Link to="/signup" style={{marginLeft: "60px"}}>Sign-up</Link>
                        </DefaultBot>)
                    }

                </BotRight>
            </BotBox>
        </HomeBase>
    );
};
