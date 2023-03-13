import React, { useState, useEffect } from "react";
import styled from "styled-components";

export default function BattleRoom() {
  const keys = ["S", "D", "F", "J", "K", "L"];
  const [activeKey, setActiveKey] = useState("");

  const handleKeyDown = (event) => {
    const key = event.key.toUpperCase();
    if (keys.includes(key)) {
      setActiveKey(key);
    }
  };

  const handleKeyUp = (event) => {
    const key = event.key.toUpperCase();
    if (keys.includes(key)) {
      setActiveKey("");
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [keys]);

  useEffect(() => {
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [keys]);

  return (
    <Container>
      <BattleRoomContainer>
        <BattleUserContainer>
          <div>
            <GradingText>Good</GradingText>
            <CountText>12</CountText>
          </div>
          {keys.map((key) => (
            <LeftColumnContainer>
              <Column active={key === activeKey} onKeyDown={handleKeyDown} />
              <HitBar />
              <KeyBox active={key === activeKey} onKeyDown={handleKeyDown}>
                {key}
              </KeyBox>
            </LeftColumnContainer>
          ))}
        </BattleUserContainer>
        <BattleUserContainer>
          <div>
            <GradingText>Good</GradingText>
            <CountText>12</CountText>
          </div>
          {keys.map((key) => (
            <RightColumnContainer>
              <Column />
              <HitBar />
              <KeyBox>{key}</KeyBox>
            </RightColumnContainer>
          ))}
        </BattleUserContainer>
      </BattleRoomContainer>
      <BottomContainer>
        <ScoreContainer>
          <Records>
            <div>oyobbeb</div>
            <div>score: 100</div>
          </Records>
        </ScoreContainer>
        <ScoreContainer>
          <Records>
            <div>score: 100</div>
            <div>HyukE</div>
          </Records>
        </ScoreContainer>
      </BottomContainer>
    </Container>
  );
}

const Container = styled.main`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  background-image: url("/image2.png");
  background-size: cover;
  background-position: center;
  box-sizing: border-box;
`;

const BattleRoomContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`;

const BattleUserContainer = styled.div`
  display: flex;
  position: relative;
  width: 30%;
  height: 100%;
`;

const LeftColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 98.5%;
  width: 30%;
  background-color: black;
  border-top: 7px solid blue;
  border-bottom: 7px solid blue;

  :nth-child(2) {
    border-left: 7px solid blue;
  }

  :last-child {
    border-right: 7px solid blue;
  }
`;

const RightColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 98.5%;
  width: 30%;
  background-color: black;
  border-top: 7px solid blue;
  border-bottom: 7px solid blue;

  :nth-child(2) {
    border-left: 7px solid blue;
  }

  :last-child {
    border-right: 7px solid blue;
  }
`;

const GradingText = styled.div`
  position: absolute;
  top: 35%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 5em;
`;

const CountText = styled.div`
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 5em;
`;

const Column = styled.div`
  display: flex;
  justify-content: center;
  height: 80%;
  border-right: 2px solid gray;

  :last-child {
    background-color: red;
    border-right: none;
  }

  ${({ active }) =>
    active &&
    `
    background: linear-gradient(
      rgba(217, 217, 217, 0) 0%,
      rgba(255, 74, 74, 0.75) 100%
    );
  `}
`;

const HitBar = styled.div`
  width: 100%;
  height: 3%;
  background-color: orange;
`;

const KeyBox = styled.div`
  display: flex;
  width: 100%;
  height: 20%;
  justify-content: center;
  align-items: center;
  font-size: 5em;
  color: white;
  box-shadow: inset 0 0 0 5px white;

  ${({ active }) =>
    active &&
    `
    background: rgba(217, 217, 217, 0.25)
  `}
`;

const BottomContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ScoreContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 50vw;
  background-color: gray;
  font-size: 2em;
  color: black;
  border: 2px solid black;
`;

const Records = styled.div`
  display: flex;
  justify-content: space-between;
  width: 80%;
`;
