import React from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

export default function Error() {
  const location = useLocation();
  const { status, message } = location.state || {};

  return (
    <ErrorContainer>
      <h1>{status || "500"}, Internal Server Error</h1>
      <p>{message || "Something went wrong."}</p>
    </ErrorContainer>
  );
}

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
