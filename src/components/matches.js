import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {APIGLink, capString, COLORS, ErrorMessage, getStoredUser} from "./shared";
import axios from "axios";
import {useHistory} from "react-router-dom";
// import {COLORS} from "./shared";
// import {Link} from "react-router-dom";

const MatchesPageBase = styled.div`
  display: inline-grid;
  justify-content: center;
  grid-area: main;
`;

const Title = styled.div`
  font-weight: 700;
  font-size: 48px;
  line-height: 58px;
  color: ${COLORS.PURPLE_T};
  margin-top: 50px;
  margin-left: 50px;
`;

const MatchesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-left: 50px;
`;

const OneItDisplay = styled.div`
  //width: 24%;
  width: 300px;
  height: 440px;
  margin: 50px 50px 20px 50px;
  background-color: ${COLORS.PINK_T};
  justify-content: center;
`;

const PictureContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 260px;
`;

const PictureDisplay = styled.img`
  max-width: 100%;
  max-height: 80%;
`;

const NameLoc = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
`;

const MatchName = styled.div`
  flex: 1;
  font-size: 32px;
  line-height: 44px;
  font-weight: 700;
  color: black;
  margin-left: 20px;
  margin-bottom: 15px;
  margin-right: 13px;
  margin-top: 5px;
  text-align: center;
`;

const MatchLoc = styled.div`
  flex: 2;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: black;
  margin-bottom: 10px;
`;

const InterestBtn = styled.div`
  display: flex;
  align-items: center;
`;

const Interests = styled.div`
  flex: 1;
  margin-left: 30px;
`;

const IntTitle = styled.div`
  font-weight: 700;
  font-size: 16px;
`;

const IntContent = styled.div`
  font-weight: 400;
  font-size: 16px;
  max-width: 130px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const DetailsBtn = styled.button`
  flex: 1;
  background: ${COLORS.BLUE_T};
  border: 3px solid ${COLORS.BLUE_T};
  border-radius: 26px;
  box-sizing: border-box;
  font-weight: 700;
  font-size: 16px;
  line-height: 29px;
  text-align: center;
  cursor: pointer;
  max-width: 110px;
  max-height: 70px;
  margin-right: 15px;
`;

const OneMatch = ({usrEmail, me, history, setError}) => {
    const [user, setUser] = useState({});
    useEffect(() => {
        axios.get(
            APIGLink + "/user",
            {
                params: {
                    email: usrEmail
                },
                headers: {
                    Authorization: me.token
                }
            }
        ).then((resp) => {
            if (resp.data.status !== "success") {
                setError("cannot get matched user data");
            } else {
                setUser(resp.data.data);
            }
        }).catch((error) => {
            if (error.response.status === 403) {
                history.push("/expired");
                return;
            }
            setError("cannot get matched user data");
        });

        // Static testing only
        // setUser({
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
    }, []);

    return (
        <OneItDisplay>
            <PictureContainer>
                <PictureDisplay
                    src={user.photo}
                ></PictureDisplay>
            </PictureContainer>
            <NameLoc>
                <MatchName>{user.name}</MatchName>
                <MatchLoc>{capString(user.location)}, {capString(user.career)}</MatchLoc>
            </NameLoc>
            <InterestBtn>
                <Interests>
                    <IntTitle>Interests:</IntTitle>

                    <IntContent>1. {capString(user.interest1)}</IntContent>
                    <IntContent>2. {capString(user.interest2)}</IntContent>
                    <IntContent>3. {capString(user.interest3)}</IntContent>
                </Interests>
                <DetailsBtn onClick={() => {
                    history.push(`/match/${usrEmail}`);
                }}>Details</DetailsBtn>
            </InterestBtn>
        </OneItDisplay>
    );
};

export const MatchesPage = () => {
    const [error, setError] = useState("");
    const [matchEmails, setMatchEmails] = useState([]);
    const me = getStoredUser();
    const history = useHistory();

    useEffect(() => {
        if (!me) {
            history.push("/signin");
            return;
        }

        axios.get(
            APIGLink + "/match",
            {
                params: {
                    email: me.email,
                },
                headers: {
                    Authorization: me.token
                }
            }
        ).then((resp) => {
            const arr = resp.data.data;
            if (arr.length === 0) {
                setError("Currently found no matches");
            } else {
                setMatchEmails(resp.data.data);
            }
        }).catch((error) => {
            if (error.response.status === 403) {
                history.push("/expired");
                return;
            }
            setError("Failed to fetch matches");
        });

        // For static testing only
        // setMatchEmails([
        //     "email1", "email2", "email3"
        // ]);
    }, []);

    return (
        <MatchesPageBase>
            <Title>Your Matches</Title>
            <ErrorMessage msg={error} hide={error === ""}/>
            <MatchesContainer>
                {matchEmails.map((email, idx) => (
                    <OneMatch
                        key={`${idx}_${email}`}
                        usrEmail={email}
                        history={history}
                        setError={setError}
                        me={me}
                    />))
                }
            </MatchesContainer>
        </MatchesPageBase>
    );
};
