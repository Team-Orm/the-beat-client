import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { getAuth, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithRedirect(auth, provider);

    if (auth) {
      navigate("/");
    }

    return true;
  };

  return (
    <LoginContainer>
      <Title>The Beat</Title>
      <BottomContainer>
        <Message>Press Login Button to Start</Message>
        <LoginButton type="button" onClick={handleLogin}>
          Login
        </LoginButton>
      </BottomContainer>
    </LoginContainer>
  );
}

const LoginContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-image: url("login.png");
  background-size: cover;
  background-position: center;
`;

const BottomContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 15%;
  align-items: center;
  animation: blink 1.75s infinite;

  @keyframes blink {
    50% {
      opacity: 0;
    }
  }
`;

const Title = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 5em;
  color: white;
`;

const Message = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.5em;
  color: white;
`;

const LoginButton = styled.button`
  width: 200px;
  height: 75px;
  background-color: transparent;
  border-radius: 10px;
  border: 3px solid rgba(255, 255, 255, 0.5);
  font-size: 2em;
  color: white;

  :hover {
    color: skyBlue;
    border: 3px solid skyBlue;
  }
`;
