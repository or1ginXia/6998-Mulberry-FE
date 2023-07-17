import React, {Fragment, useEffect, useState} from "react";
import styled from "styled-components";
import {
    APIGLink,
    COLORS,
    defaultUser,
    ErrorMessage,
    getStoredUser,
    S3ImgUrl,
    S3Upload, setStoredUser
} from "./shared";
import {Link, useHistory} from "react-router-dom";
import moment from "moment";
import axios from "axios";

const EditProfileBase = styled.div`
  display: inline-grid;
  justify-content: center;
  grid-area: main;
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

const ChangePassBtn = styled.button`
  flex: 1;
  background: ${COLORS.BLUE_T};
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

const SaveBtn = styled.button`
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
  min-width: 70px;
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

const GenInput = styled.input`
  flex: 1;
  text-align: left;
  font-weight: 400;
  font-size: 22px;
  line-height: 31px;
  background: ${COLORS.PINK_T};
  margin-right: 50px;
`;

const ImgInput = styled.input`
  background: ${COLORS.ORANGE_T};
  border: 3px solid #000000;
  border-radius: 26px;
`;

const GenSelect = styled.select`
  flex: 1;
  text-align: left;
  font-weight: 400;
  font-size: 22px;
  line-height: 31px;
  background: ${COLORS.PINK_T};
  margin-right: 50px;
`;

const SecRowRhsContainer = styled.div`
  flex: 1;
`;

const ImageContainer = styled.div`
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

export const EditProfile = ({toComp, user, setUser}) => {
    const [state, setState] = useState({...defaultUser});
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [error, setError] = useState("");
    const history = useHistory();

    useEffect(() => {
        const storedUser = getStoredUser();
        if (storedUser) {
            setState(storedUser);
        } else {
            history.push("/signin");
        }
    }, []);

    const onSave = () => {
        const toSend = {...state};
        const ignoredFields = ["email", "status", "password", "created_ts", "email_verified", "photo", "expiry",
            "token"];
        let hasError = false;
        Object.keys(toSend).every((key) => {
            if (key === "birthday") {
                const momentDate = moment(toSend[key]);
                if (momentDate.isValid()) {
                    toSend[key] = momentDate.format("MM-DD-YYYY");
                } else {
                    setError("Invalid birthday date");
                    hasError = true;
                    return false;
                }
            } else if (key !== "name" && key !== "height" && !key.startsWith("prompt") &&
                !ignoredFields.includes(key) && toSend[key]) {
                toSend[key] = toSend[key].toLowerCase();
            }

            if ((!ignoredFields.includes(key)) && (!toSend.hasOwnProperty(key) || !toSend[key])) {
                setError(`${key} needs a value`);
                hasError = true;
                return false;
            }
            return true;
        });
        if (!hasError) {
            // take care of uploading the image
            if (!file && !toSend.photo) {
                setError("Please select a profile image");
                return;
            }
            if (file) {
                const extension = file.name.split(".").pop().toLowerCase();
                axios.put(
                    S3Upload + `/${user.email}.${extension}`,
                    file
                ).then((resp) => {
                    console.log("Image upload success");
                }).catch((error) => {
                    setError("Image upload failed");
                });
                toSend.photo = `${S3ImgUrl + `/${user.email}.${extension}`}`;
            }
            setError("");
            // Now send it
            // const tmp = {...toSend};
            // delete tmp.expiry;
            axios.put(
                APIGLink + `/user`,
                toSend,
                {
                    headers: {
                        Authorization: state.token,
                    },
                    params: {
                        email: user.email,
                    }
                }
            ).then((resp) => {
                history.push("/");
            }).catch((error) => {
                if (error.response.status === 403) {
                    history.push("/expired");
                    return;
                }
                setError(error.response.data.message);
            });
            setStoredUser(toSend);
            setUser(toSend);
        }
    };

    const updateState = (ev, field) => {
        const updatedState = {...state};
        updatedState[field] = ev.target.value;
        setState(updatedState);
    };

    const updateImg = (ev) => {
        const selectedFile = ev.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            setPreviewUrl(URL.createObjectURL(selectedFile));
        } else {
            setPreviewUrl("");
        }
    };

    return (
        <Fragment>
            <ErrorMessage msg={error} hide={error === ""}/>
            <EditProfileBase>
                <FirstRow>
                    <Title>{toComp ? "Complete" : "Edit"} Your Profile</Title>
                    {
                        toComp ? null :
                            <Link to="/changepass">
                                <ChangePassBtn>Change Password</ChangePassBtn>
                            </Link>
                    }
                    <SaveBtn onClick={onSave}>Save</SaveBtn>
                </FirstRow>

                <SecondRow>
                    <GenSection>
                        <SectionTitle>General Information</SectionTitle>
                        <GenRow>
                            <GenTitle>Full Name:</GenTitle>
                            <GenInput name={"name"}
                                      type={"text"}
                                      placeholder={"Full Name"}
                                      value={state.name}
                                      onChange={(ev) => {
                                          updateState(ev, "name");
                                      }}
                            />
                        </GenRow>
                        <GenRow>
                            <GenTitle>Gender:</GenTitle>
                            <GenSelect
                                // defaultValue={"male"}
                                value={state.gender}
                                onChange={(ev) => {
                                    updateState(ev, "gender");
                                }}>
                                <option value="male">male</option>
                                <option value="female">female</option>
                            </GenSelect>
                        </GenRow>
                        <GenRow>
                            <GenTitle>Birthday:</GenTitle>
                            <GenInput name={"birthday"}
                                      type={"text"}
                                      placeholder={"Birthday"}
                                      value={state.birthday}
                                      onChange={(ev) => {
                                          updateState(ev, "birthday");
                                      }}
                            />
                        </GenRow>
                        <GenRow>
                            <GenTitle>Location:</GenTitle>
                            <GenInput name={"location"}
                                      type={"text"}
                                      placeholder={"Location"}
                                      value={state.location}
                                      onChange={(ev) => {
                                          updateState(ev, "location");
                                      }}
                            />
                        </GenRow>
                        <GenRow>
                            <GenTitle>Career:</GenTitle>
                            <GenInput name={"career"}
                                      type={"text"}
                                      placeholder={"Career"}
                                      value={state.career}
                                      onChange={(ev) => {
                                          updateState(ev, "career");
                                      }}
                            />
                        </GenRow>
                        <GenRow>
                            <GenTitle>Height:</GenTitle>
                            <GenInput name={"height"}
                                      type={"text"}
                                      placeholder={"Height"}
                                      value={state.height}
                                      onChange={(ev) => {
                                          updateState(ev, "height");
                                      }}
                            />
                        </GenRow>
                    </GenSection>
                    <SecRowRhsContainer>
                        <ImgInput
                            type="file"
                            accept="image/*"
                            onChange={updateImg}/>
                        <ImageContainer>
                            {
                                previewUrl ?
                                    <ImageDisplay src={previewUrl}/> :
                                    state.photo ?
                                        <ImageDisplay src={state.photo}/> :
                                        <ImageDisplay src={require("../imgs/default_profile.jpg")}/>
                            }
                        </ImageContainer>
                    </SecRowRhsContainer>

                </SecondRow>
                <ThirdRow>
                    <GenSection>
                        <SectionTitle>Interests</SectionTitle>
                        <SectionSubTitle>Fill this out to find better matches!</SectionSubTitle>
                        <GenRow>
                            <GenTitle>Interest 1:</GenTitle>
                            <GenInput name={"interest1"}
                                      type={"text"}
                                      placeholder={"Your Interest"}
                                      value={state.interest1}
                                      onChange={(ev) => {
                                          updateState(ev, "interest1");
                                      }}
                            />
                        </GenRow>
                        <GenRow>
                            <GenTitle>Interest 2:</GenTitle>
                            <GenInput name={"interest2"}
                                      type={"text"}
                                      placeholder={"Your Interest"}
                                      value={state.interest2}
                                      onChange={(ev) => {
                                          updateState(ev, "interest2");
                                      }}
                            />
                        </GenRow>
                        <GenRow>
                            <GenTitle>Interest 3:</GenTitle>
                            <GenInput name={"interest3"}
                                      type={"text"}
                                      placeholder={"Your Interest"}
                                      value={state.interest3}
                                      onChange={(ev) => {
                                          updateState(ev, "interest3");
                                      }}
                            />
                        </GenRow>
                    </GenSection>
                    <GenSection>
                        <SectionTitle>Prompts</SectionTitle>
                        <SectionSubTitle>Fill this out to find better matches!</SectionSubTitle>
                        <GenRow>
                            <GenTitle>Most valued personality:</GenTitle>
                            <GenSelect
                                // defaultValue={"Easy-going"}
                                value={state.prompt1}
                                onChange={(ev) => {
                                    updateState(ev, "prompt1");
                                }}>
                                <option value="Introverted">Introverted</option>
                                <option value="Outgoing">Outgoing</option>
                                <option value="Analytical">Analytical</option>
                                <option value="Creative">Creative</option>
                                <option value="Optimistic">Optimistic</option>
                                <option value="Ambitious">Ambitious</option>
                                <option value="Easy-going">Easy-going</option>
                            </GenSelect>
                        </GenRow>
                        <GenRow>
                            <GenTitle>What's your favorite food:</GenTitle>
                            <GenSelect
                                // defaultValue={"Thai"}
                                value={state.prompt2}
                                onChange={(ev) => {
                                    updateState(ev, "prompt2");
                                }}>
                                <option value="Thai">Thai</option>
                                <option value="Indian">Indian</option>
                                <option value="French">French</option>
                                <option value="Chinese">Chinese</option>
                                <option value="Mexican">Mexican</option>
                                <option value="Italian">Italian</option>
                                <option value="Greek">Greek</option>
                            </GenSelect>
                        </GenRow>
                        <GenRow>
                            <GenTitle>Most interested field to work in:</GenTitle>
                            <GenSelect
                                // defaultValue={"Science"}
                                value={state.prompt3}
                                onChange={(ev) => {
                                    updateState(ev, "prompt3");
                                }}>
                                <option value="Science">Science</option>
                                <option value="Arts">Arts</option>
                                <option value="Business">Business</option>
                                <option value="Education">Education</option>
                                <option value="Law">Law</option>
                                <option value="Medicine">Medicine</option>
                                <option value="Engineering">Engineering</option>
                            </GenSelect>
                        </GenRow>
                    </GenSection>
                </ThirdRow>
            </EditProfileBase>

        </Fragment>

    );
};
