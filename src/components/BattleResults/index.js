import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import styled from "styled-components";
import { auth } from "../../features/api/firebaseApi";

export default function BattleResults() {
  const combo = useSelector((state) => state.game.combo);
  const totalScore = useSelector((state) => state.game.totalScore);
  const roomId = useSelector((state) => state.game.roomid);
  const [socket, setSocket] = useState();

  const { displayName, photoURL, uid } = auth.currentUser
    ? auth.currentUser
    : { displayName: null, photoURL: null, uid: null };

  useEffect(() => {
    const socketClient = io(`${process.env.REACT_APP_SOCKET_URL}/`, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
      query: { displayName, photoURL, uid, roomId },
    });
    setSocket(socketClient);

    return () => {
      socketClient.disconnect();
    };
  }, [displayName, photoURL, roomId, uid]);

  return (
    <BattleResultsContainer>
      <PageTitle>Results</PageTitle>
      <ResultsWrapper>
        <ResultPanel>
          <Winner>Winner</Winner>
          <UserContainer>
            <UserImage src={photoURL} />
            <ResultsBox>{displayName}</ResultsBox>
          </UserContainer>
          {Object.keys(combo).map((key) => (
            <RecordsContainer key={key}>
              <ResultsBox>{key}</ResultsBox>
              <Score>{combo[key]}</Score>
            </RecordsContainer>
          ))}
          <StyledHr />
          <RecordsContainer>
            <ResultsBox>TotalScore: </ResultsBox>
            <Score>{totalScore}</Score>
          </RecordsContainer>
        </ResultPanel>
        <ResultPanel>
          <Winner>Winner</Winner>
          <UserContainer>
            <UserImage src={photoURL} />
            <ResultsBox>{displayName}</ResultsBox>
          </UserContainer>
          {Object.keys(combo).map((key) => (
            <RecordsContainer key={key}>
              <ResultsBox>{key}</ResultsBox>
              <Score>{combo[key]}</Score>
            </RecordsContainer>
          ))}
          <StyledHr />
          <RecordsContainer>
            <ResultsBox>TotalScore: </ResultsBox>
            <Score>{totalScore}</Score>
          </RecordsContainer>
        </ResultPanel>
      </ResultsWrapper>
      <ButtonContainer>
        <ActionButton type="button">기록하기</ActionButton>
        <ActionButton type="button">나가기</ActionButton>
      </ButtonContainer>
    </BattleResultsContainer>
  );
}

const BattleResultsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 100vw;
`;

const PageTitle = styled.h2`
  display: flex;
  justify-content: center;
  font-size: 3em;
  margin: 0;
  padding: 20px;
  width: 100%;
`;

const ResultsWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  height: 100%;
`;

const ResultPanel = styled.div`
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;
  align-items: center;
  margin: 0 5%;
  width: 100%;
  height: 100%;
  border: 5px solid black;
  border-radius: 10px;
  background-color: transparent;
`;

const Winner = styled.h1`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3em;
  width: 100%;
  height: 12.5%;
  margin: 0;
`;

const UserContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 100%;
`;

const UserImage = styled.img`
  width: 70px;
  height: 70px;
  border-radius: 50%;
`;

const RecordsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 70%;
`;

const ResultsBox = styled.div`
  display: flex;
  align-items: center;
  font-size: 2em;
  color: black;
`;

const Score = styled.h1`
  font-size: 2em;
  color: black;
`;

const StyledHr = styled.hr`
  width: 75%;
  border: 3px solid black;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 20%;
`;

const ActionButton = styled.button`
  width: 20%;
  height: 40%;
  background-color: transparent;
  border-radius: 10px;
  border: 3px solid black;
  font-size: 2em;
  color: black;

  :hover {
    color: white;
    border: 3px solid black;
    background-color: black;
  }
`;
