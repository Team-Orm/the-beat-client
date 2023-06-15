import React from "react";
import styled from "styled-components";

export default function NotFound() {
  return (
    <ErrorContainer>
      <h1>404 Not Found</h1>
      <p>The requested resource could not be found.</p>
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
