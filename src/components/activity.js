import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {APIGLink, capString, COLORS, getStoredUser} from "./shared";
// import {COLORS} from "./shared";
// import {Link} from "react-router-dom";
import axios from "axios";
import {useHistory} from "react-router-dom";

const ActivityPageBase = styled.div`
  display: inline-grid;
  grid-area: main;
  max-width: 80%;
`;

const Title = styled.div`
  font-weight: 700;
  font-size: 44px;
  line-height: 58px;
  color: ${COLORS.PURPLE_T};
  margin-top: 50px;
  margin-bottom: 50px;
  margin-left: 70px;
`;

const InfoSection = styled.div`
  margin-left: 220px;
`;

const OneLine = styled.div`
  display: flex;
  margin-bottom: 30px;
`;

const InfoTitle = styled.div`
  flex: 1;
  font-weight: 700;
  font-size: 28px;
  margin-right: 10px;
`;

const InfoInfo = styled.div`
  flex: 1;
  font-weight: 400;
  font-size: 28px;
  margin-left: 10px;
`;

const InviteBtn = styled.button`
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
  max-width: 200px;
  min-height: 60px;
  margin-top: 50px;
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
  max-width: 140px;
  max-height: 70px;
  margin-top: 50px;
  margin-left: 240px;
`;

export const ActivityPage = ({id, rcvEmail, rcvName}) => {
    const me = getStoredUser();
    const [allInfo, setAllInfo] = useState({});
    const history = useHistory();
    const [iAccept, setIAccepted] = useState(false);
    const [oAccept, setOAccepted] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!me) {
            history.push("/signin");
            return;
        }

        axios.get(
            APIGLink + `/activity/${id}`,
            {
                headers: {
                    Authorization: me.token
                }
            }
        ).then((resp) => {
            if (resp.data.status !== "success") {
                console.error("Failed to get activity info on activities page");
            } else {
                const aData = resp.data.data;
                if (me.email === aData["user1_email"]) {
                    if (aData["user1_accept"]) {
                        setIAccepted(true);
                    }
                    if (aData["user2_accept"]) {
                        setOAccepted(true);
                    }
                } else if (me.email === aData["user2_email"]) {
                    if (aData["user2_accept"]) {
                        setIAccepted(true);
                    }
                    if (aData["user1_accept"]) {
                        setOAccepted(true);
                    }
                }
                console.log(aData);
                setAllInfo(aData);
                setLoading(false);
            }
        }).catch((error) => {
            if (error.response.status === 403) {
                history.push("/expired");
                return;
            }
            console.error("Failed to get activity info on activities page2");
        });
    }, []);

    const goBck = () => {
        history.push(`/chat/${rcvEmail}/${rcvName}`);
    };

    const acceptInv = (ev) => {
        ev.preventDefault();

        axios.put(
            APIGLink + `/activity/status/${id}`,
            {},
            {
                headers: {
                    Authorization: me.token,
                }
            }
        ).then(() => {
            setIAccepted(true);
        }).catch((err) => {
            console.error("Failed to accept invite");
        });
    };

    if (loading) {
        return (
            <ActivityPageBase>
                <h2>Loading Activity Info...</h2>
            </ActivityPageBase>
        );
    }

    return (
        <ActivityPageBase>
            <Title>Activity Information</Title>
            <InfoSection>
                <OneLine>
                    <InfoTitle>Activity:</InfoTitle>
                    <InfoInfo>{capString(allInfo["activity_name"])}</InfoInfo>
                </OneLine>
                <OneLine>
                    <InfoTitle>Time:</InfoTitle>
                    <InfoInfo>{allInfo["arrange_time"]}</InfoInfo>
                </OneLine>
                <OneLine>
                    <InfoTitle>Advertiser:</InfoTitle>
                    <InfoInfo>{capString(allInfo["advertiser_name"])}</InfoInfo>
                </OneLine>
                <OneLine>
                    <InfoTitle>Location:</InfoTitle>
                    <InfoInfo>{capString(allInfo["address"])}</InfoInfo>
                </OneLine>
                <OneLine>
                    <InfoTitle>Original Price:</InfoTitle>
                    <InfoInfo>${allInfo["origin_price"]}</InfoInfo>
                </OneLine>
                <OneLine>
                    <InfoTitle>Discount:</InfoTitle>
                    <InfoInfo>{allInfo["discount"]}</InfoInfo>
                </OneLine>
                {
                    iAccept ?
                        oAccept ?
                            <h2>You both have accepted the activity! Set up a place and time to
                                meet!</h2> :
                            <h2>You have accepted the activity. Waiting on your match to
                                accept.</h2> :
                        null
                }
                <OneLine>
                    {
                        iAccept ? null :
                            <InviteBtn onClick={acceptInv}>I'm Going</InviteBtn>
                    }
                    <BackBtn onClick={goBck}>Back</BackBtn>
                </OneLine>
            </InfoSection>

        </ActivityPageBase>
    );
};
