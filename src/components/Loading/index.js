import React from "react";
import styled from "styled-components";

export default function Loading({ text = "Loading" }) {
  return (
    <Container>
      <Spinner />
      {text}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  font-size: 32px;
  color: white;
  background-image: url("login.png");
  background-size: cover;
  background-position: center;
`;

const Spinner = styled.div`
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top: 4px solid white;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  margin: 20px;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
