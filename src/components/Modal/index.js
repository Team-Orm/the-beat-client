import React from "react";
import styled from "styled-components";

export default function Modal({ children }) {
  return (
    <Content>
      <ModalWrapper>{children}</ModalWrapper>
    </Content>
  );
}

const Content = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1000;
`;

const ModalWrapper = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  width: 30%;
  height: 50%;
  padding: 100px;
  z-index: 50;
  border-radius: 20px;
`;
