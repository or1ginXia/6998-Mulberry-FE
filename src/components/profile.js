import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {COLORS, defaultUser, getStoredUser, APIGLink, capString} from "./shared";
import {Link, useHistory} from "react-router-dom";
import axios from "axios";

const ProfileBase = styled.div`
  display: inline-grid;
  justify-content: center;
  grid-area: main;
  margin-bottom: 100px;
`;

const FirstRow = styled.div`
  display: flex;
  width: 100%;
  align-content: center;
  align-items: center;
  min-width: 1140px;
  margin-top: 30px;
`;

const Title = styled.div`
  flex: 3;
  font-weight: 700;
  font-size: 48px;
  line-height: 58px;
  color: ${COLORS.PURPLE_T};
`;

const EditBtn = styled.button`
  flex: 1;
  background: ${COLORS.ORANGE_T};
  border: 3px solid ${COLORS.PURPLE_T};
  border-radius: 26px;
  box-sizing: border-box;
  font-weight: 700;
  font-size: 24px;
  line-height: 29px;
  text-align: center;
  cursor: pointer;
  min-width: 180px;
  min-height: 50px;
`;

const MessageBtn = styled.button`
  flex: 1;
  background: ${COLORS.ORANGE_T};
  border: 3px solid ${COLORS.PURPLE_T};
  border-radius: 26px;
  box-sizing: border-box;
  font-weight: 700;
  font-size: 24px;
  line-height: 29px;
  text-align: center;
  cursor: pointer;
  min-width: 180px;
  min-height: 50px;
`;

const BackBtn = styled.button`
  flex: 1;
  background: ${COLORS.PINK_T};
  border: 3px solid ${COLORS.PURPLE_T};
  border-radius: 26px;
  box-sizing: border-box;
  font-weight: 700;
  font-size: 24px;
  line-height: 29px;
  text-align: center;
  cursor: pointer;
  min-width: 100px;
  min-height: 50px;
`;

const SecondRow = styled.div`
  display: flex;
  width: 100%;
  align-content: center;
  align-items: center;
  min-width: 1140px;
  margin-top: 30px;
`;

const GenSection = styled.div`
  flex: 1;
`;

const GenRow = styled.div`
  display: flex;
  margin-top: 15px;
`;

const GenTitle = styled.div`
  flex: 1;
  text-align: left;
  font-weight: 700;
  font-size: 22px;
  line-height: 31px;
`;

const GenInfo = styled.div`
  flex: 1;
  text-align: left;
  font-weight: 400;
  font-size: 22px;
  line-height: 31px;
`;

const ImageContainer = styled.div`
  flex: 1;
  max-height: 350px;
  max-width: 350px;
`;

const ImageDisplay = styled.img`
  max-width: 350px;
  max-height: 350px;
`;

const ThirdRow = styled.div`
  display: flex;
  width: 100%;
  align-content: center;
  align-items: flex-start;
  min-width: 1140px;
  margin-top: 30px;
`;

const SectionTitle = styled.div`
  font-weight: 700;
  font-size: 32px;
  line-height: 39px;
  text-decoration: underline;
  color: #000000;
`;

const SectionSubTitle = styled.div`
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  color: ${COLORS.BROWN_T};
`;


// const BackBtn = styled.button`
//   flex: 1;
//   background: ${COLORS.PINK_T};
//   border: 3px solid ${COLORS.PURPLE_T};
//   border-radius: 26px;
//   box-sizing: border-box;
//   font-weight: 700;
//   font-size: 24px;
//   line-height: 29px;
//   text-align: center;
// `;

export const Profile = ({matchProf, matchUser}) => {
    const [state, setState] = useState({});
    const history = useHistory();

    useEffect(() => {
        const storedUser = getStoredUser();
        if (!matchProf) {
            // Regular profile display
            if (storedUser) {
                setState(storedUser);
            } else {
                history.push("/signin");
            }
        } else {
            // Match profile display
            axios.get(
                APIGLink + "/user",
                {
                    params: {
                        email: matchUser
                    },
                    headers: {
                        Authorization: storedUser.token
                    }
                }
            ).then((resp) => {
                if (resp.data.status !== "success") {
                    console.error("Error fetching profile for a match");
                } else {
                    setState(resp.data.data);
                }
            }).catch((error) => {
                if (error.response.status === 403) {
                    history.push("/expired");
                    return;
                }
                console.error("Error fetching profile for a match2")
            });

            // Static testing only
            // setState({
            //     photo: "https://mulberry-photo.s3.amazonaws.com/yshi@cu.com.jpg",
            //     location: "new york",
            //     status: "ACTIVE",
            //     email: "yshi@cu.com",
            //     name: "Bill",
            //     gender: "male",
            //     email_verified: false,
            //     password: null,
            //     interest3: "int3",
            //     height: "66",
            //     interest1: "int1",
            //     interest2: "int2",
            //     career: "student",
            //     prompt3: "Science",
            //     prompt2: "Thai",
            //     created_ts: "2023-04-14 00:13:43",
            //     birthday: "01-01-1111",
            //     prompt1: "Easy-going"
            // });
        }
    }, []);

    return (
        <ProfileBase>
            <FirstRow>
                <Title>Profile Information</Title>
                {
                    matchProf ?
                        <Link to={`/chat/${matchUser}/${state.name}`}>
                            <MessageBtn>Message</MessageBtn>
                        </Link> : null
                }
                {
                    matchProf ?
                        <Link to={"/matches"}>
                            <BackBtn>Back</BackBtn>
                        </Link> :
                        <Link to="/editprofile">
                            <EditBtn>Edit Profile</EditBtn>
                        </Link>
                }
            </FirstRow>
            <SecondRow>
                <GenSection>
                    <SectionTitle>General Information</SectionTitle>
                    <GenRow>
                        <GenTitle>Full Name:</GenTitle>
                        <GenInfo>{capString(state.name)}</GenInfo>
                    </GenRow>
                    <GenRow>
                        <GenTitle>Gender:</GenTitle>
                        <GenInfo>{capString(state.gender)}</GenInfo>
                    </GenRow>
                    <GenRow>
                        <GenTitle>Birthday:</GenTitle>
                        <GenInfo>{state.birthday}</GenInfo>
                    </GenRow>
                    <GenRow>
                        <GenTitle>Location:</GenTitle>
                        <GenInfo>{capString(state.location)}</GenInfo>
                    </GenRow>
                    <GenRow>
                        <GenTitle>Career:</GenTitle>
                        <GenInfo>{capString(state.career)}</GenInfo>
                    </GenRow>
                    <GenRow>
                        <GenTitle>Height:</GenTitle>
                        <GenInfo>{state.height}</GenInfo>
                    </GenRow>
                </GenSection>
                <ImageContainer>
                    {
                        state.photo ?
                            <ImageDisplay src={state.photo}/> :
                            <ImageDisplay src={require("../imgs/default_profile.jpg")}/>
                    }
                </ImageContainer>
            </SecondRow>
            <ThirdRow>
                <GenSection>
                    <SectionTitle>Interests</SectionTitle>
                    <SectionSubTitle>Fill this out to find better matches!</SectionSubTitle>
                    <GenRow>
                        <GenTitle>Interest 1:</GenTitle>
                        <GenInfo>{capString(state.interest1)}</GenInfo>
                    </GenRow>
                    <GenRow>
                        <GenTitle>Interest 2:</GenTitle>
                        <GenInfo>{capString(state.interest2)}</GenInfo>
                    </GenRow>
                    <GenRow>
                        <GenTitle>Interest 3:</GenTitle>
                        <GenInfo>{capString(state.interest3)}</GenInfo>
                    </GenRow>
                </GenSection>
                <GenSection>
                    <SectionTitle>Prompts</SectionTitle>
                    <SectionSubTitle>Fill this out to find better matches!</SectionSubTitle>
                    <GenRow>
                        <GenTitle>Most valued personality:</GenTitle>
                        <GenInfo>{state.prompt1}</GenInfo>
                    </GenRow>
                    <GenRow>
                        <GenTitle>What's your favorite food:</GenTitle>
                        <GenInfo>{state.prompt2}</GenInfo>
                    </GenRow>
                    <GenRow>
                        <GenTitle>Most interested field to work in:</GenTitle>
                        <GenInfo>{state.prompt3}</GenInfo>
                    </GenRow>
                </GenSection>
            </ThirdRow>
        </ProfileBase>
    );
};
