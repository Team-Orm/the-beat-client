import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

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
  z-index: 50px;
  border-radius: 20px;
`;

const Content = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1000;
`;

export default function Modal({ href, children }) {
  const navigate = useNavigate();

  return (
    <Content onClick={() => navigate(href)}>
      <ModalWrapper>{children}</ModalWrapper>
    </Content>
  );
}
