import React, {Fragment, useEffect} from "react";
import styled from "styled-components";
import {Link} from "react-router-dom";
import {COLORS} from "./shared";

const HeaderLeftBase = styled.div`
  flex-grow: 1;

  & > a {
    text-decoration: none;

    & > h2 {
      color: ${COLORS.PINK_T};
      margin: 0.75em 0 0.75em 0.5em;
      padding-left: 0.5em;
      font-size: 24px;
    }
  }
`;

const HeaderLeft = () => {
    return (
        <HeaderLeftBase>
            <Link to="/">
                <h2>MULBERRY</h2>
            </Link>
        </HeaderLeftBase>
    );
};

// For future use
// HeaderLeft.propTypes = {
//
// };

/*************************************************************************/

const HeaderRightBase = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-right: 0.5em;

  & > a {
    color: ${COLORS.PINK_T};
    padding-right: 1em;
    font-size: 18px;
  }

  & > p {
    color: ${COLORS.PINK_T};
    padding-right: 1em;
    font-size: 18px;
  }
`;

const HeaderRight = ({username}) => {
    const isLoggedIn = username !== "";
    let tmpIdx = username.indexOf(" ");
    if (tmpIdx === -1)
        tmpIdx = username.length;
    const firstName = username === "" ? "" : username.substring(0, tmpIdx);
    useEffect(() => {
    }, [username]);
    return (
        <HeaderRightBase>
            {isLoggedIn ? (
                <Fragment>
                    <Link id="matchesLink" to="/matches">
                        Matches
                    </Link>
                    <Link id="chatlistLink" to="/chatlist">
                        Chat
                    </Link>
                    <Link id="profileLink" to="/profile">
                        Profile
                    </Link>
                    <p>Hello, {firstName}</p>
                    <Link id="logoutLink" to="/logout">
                        Sign Out
                    </Link>
                </Fragment>
            ) : (
                <Fragment>
                    <Link id="signinLink" to="/signin">
                        Sign In
                    </Link>
                    <Link id="signupLink" to="/signup">
                        Sign Up
                    </Link>
                </Fragment>
            )}

        </HeaderRightBase>
    );
};

// For future use
// HeaderRight.propTypes = {
//
// };

/*******************************************************************/

const HeaderBase = styled.div`
  grid-area: hd;
  display: flex;
  background: ${COLORS.PURPLE_T};
`;

export const Header = ({username}) => (
    <HeaderBase>
        <HeaderLeft/>
        <HeaderRight username={username}/>
    </HeaderBase>
);

// For future use
// Header.propTypes = {
//
// };
