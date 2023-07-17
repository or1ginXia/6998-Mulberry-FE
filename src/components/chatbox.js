import React, {useState, useEffect} from "react";
import axios from "axios";
import "./css/chatboax.css";
import styled from "styled-components";
import {useHistory} from "react-router-dom";
import {APIGLink, ErrorMessage, getStoredUser} from "./shared";
// import {COLORS} from "./shared";
import {Link} from "react-router-dom";

const ChatPageBase = styled.div`
  display: inline-grid;
  justify-content: center;
  grid-area: main;
`;

export const ChatBox = ({rcvEmail, rcvName}) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [myImg, setMyImg] = useState("");
    const [oImg, setOImg] = useState("");
    const [error, setError] = useState("");
    const history = useHistory();
    const user = getStoredUser();

    const [time, setTime] = useState(Date.now());

    const processMsg = async (origArr) => {
        const newArr = [...origArr];
        const getActivity = async (id) => {
            try {
                const resp = await axios.get(
                    APIGLink + `/activity/${id}`,
                    {
                        headers: {
                            Authorization: user.token
                        }
                    });
                if (resp.data.status !== "success") {
                    return "errno";
                } else {
                    return `System Activity Suggestion: checkout ${resp.data.data["activity_name"]} at 
                    ${resp.data.data["address"]} for ${resp.data.data["discount"]} off!`;
                }
            } catch (err) {
                if (err.response.status === 403) {
                    return "expired";
                }
                return "errno";
            }
        };

        for (let i = 0; i < newArr.length; ++i) {
            if (newArr[i].sender_email === "0") {
                if (!newArr[i].message) {
                    console.error("Malformed ID");
                    continue;
                }
                const activityInfo = await getActivity(newArr[i].message);
                if (activityInfo === "expired") {
                    history.push("/expired");
                    return;
                } else if (activityInfo === "errno") {
                    console.error("getting activity detail failed");
                    continue;
                }
                newArr[i].activity_id = newArr[i].message;
                newArr[i].message = activityInfo;
            }
        }
        return newArr;
    };

    // Make request every 2s
    useEffect(() => {
        if (!user) {
            history.push("/signin");
            return;
        }

        const interval = setInterval(() => {
            axios.get(
                APIGLink + `/chat/message`,
                {
                    params: {
                        email: user.email,
                        target_user_email: rcvEmail
                    },
                    headers: {
                        Authorization: user.token
                    }
                }
            ).then((resp) => {
                const arr = resp.data.data;
                arr.sort((a, b) => (a.timestamp - b.timestamp));
                processMsg(arr).then((newArr) => {
                    const oldStorage = localStorage.getItem("chat");
                    let newStorage;
                    if (oldStorage) {
                        newStorage = JSON.parse(oldStorage);
                    } else {
                        newStorage = {};
                    }
                    newStorage[rcvEmail] = newArr;
                    try {
                        localStorage.setItem("chat", JSON.stringify(newStorage));
                    } catch (e) {
                        if (e instanceof DOMException) {
                            console.error("LocalStorage quota exceeded");
                        } else {
                            throw e;
                        }
                    }
                    setMessages(newArr);
                });
            }).catch((error) => {
                if (error.response.status === 403) {
                    history.push("/expired");
                    return;
                }
                console.error(`Failed to fetch messages`);
            });
            setTime(Date.now());
        }, 5000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    // On load, just get the user profile pic once
    useEffect(() => {
        if (!user) {
            history.push("/signin");
            return;
        }

        axios.get(
            APIGLink + `/user/photo`,
            {
                params: {
                    email: rcvEmail,
                },
                headers: {
                    Authorization: user.token
                }
            }
        ).then((resp) => {
            setOImg(resp.data.data["link"]);
        }).catch((error) => {
            if (error.response.status === 403) {
                history.push("/expired");
                return;
            }
            console.error(`Failed to get img url for ${rcvEmail}`);
        });

        const storedChat = localStorage.getItem("chat");
        if (storedChat) {
            const parsed = JSON.parse(storedChat);
            const mesgs = parsed[rcvEmail];
            if (mesgs) {
                setMessages(mesgs);
            }
        }
        setMyImg(user.photo);
        const chatbox = document.querySelector(".chatbox");
        if (chatbox) {
            chatbox.scrollTop = chatbox.scrollHeight;
        }
    }, []);

    const sendMessage = async (event) => {
        event.preventDefault();
        setError("");
        let ts = messages.length === 0 ? "0" : (parseInt(messages[messages.length - 1].timestamp) + 1).toString();
        const newMesg = {
            message: newMessage,
            timestamp: ts,
        };

        const toAPI = () => {
            return new Promise((resolve, reject) => {
                axios.post(
                    APIGLink + `/chat/message/${rcvEmail}`,
                    newMesg,
                    {
                        params: {
                            email: user.email
                        },
                        headers: {
                            Authorization: user.token,
                        }
                    }
                ).then((resp) => {
                    if (resp.data.status !== "success") {
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                }).catch((err) => {
                    if (error.response.status === 403) {
                        history.push("/expired");
                        return;
                    }
                    reject(false);
                });
            });
        };

        try {
            const res = await toAPI();
            if (!res) {
                // newMesg["sender_email"] = "errno";
                setError("Failed to send last message1");
            } else {
                newMesg["sender_email"] = user.email;
            }
        } catch (error) {
            // newMesg["sender_email"] = "errno";
            setError("Failed to send message");
        }
        setMessages(messages => [...messages, newMesg]);
        // Clear the newMessage input field
        setNewMessage("");
    };

    const goBack = () => {
        history.push("/chatlist");
    };

    return (
        <ChatPageBase>
            <div className="title">Conversation with {rcvName}</div>
            <ErrorMessage msg={error} hide={error === ""}/>
            <div className="chatbox">
                <div className="topbar">
                    <div id="topbarName">{rcvName}</div>
                    <div>
                        <button id="backbtn" onClick={goBack}>Back</button>
                    </div>

                </div>
                <div className="messages">
                    {messages.map((message, index) => (
                        <div key={index}
                             className={`message ${message.sender_email === user.email ? "you" :
                                 message.sender_email === "0" ? "system" : "other"}`}>
                            {
                                message.sender_email === "0" ?
                                    <img className="avatar"
                                         src={require("../imgs/default_profile.jpg")}></img> :
                                    message.sender_email === user.email ?
                                        myImg ? <img className="avatar" src={myImg}></img> :
                                            <img className="avatar"
                                                 src={require("../imgs/default_profile.jpg")}></img> :
                                        oImg ? <img className="avatar" src={oImg}></img> :
                                            <img className="avatar"
                                                 src={require("../imgs/default_profile.jpg")}></img>
                            }
                            <div className="message-content">{message.message} {
                                message.activity_id ?
                                    <Link
                                        to={`/activity/${message.activity_id}/${rcvEmail}/${rcvName}`}>
                                        Click here for details
                                    </Link>
                                    : null
                            }</div>

                        </div>
                    ))}
                </div>
                <form onSubmit={sendMessage} className="message-input">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                    />
                    <button type="submit">Send</button>
                </form>
            </div>
        </ChatPageBase>

    );
};
