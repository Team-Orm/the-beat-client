import React from "react";
import styled from "styled-components";

export default function Login() {
  return (
    <LoginContainer>
      <Title>The Beat</Title>
      <CircularButton type="submit">Login</CircularButton>
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

const Title = styled.h1`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 5em;
  color: white;
`;

const CircularButton = styled.button`
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
