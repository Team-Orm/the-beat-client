import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { auth } from "../../features/api/firebaseApi";
import { resetRecords } from "../../features/reducers/gameSlice";
import { RECEIVE_RESULTS, SEND_RESULTS } from "../../store/constants";

export default function BattleResults() {
  const dispatch = useDispatch();
  const { resultId } = useParams();
  const comboResults = useSelector((state) => state.game.comboResults);
  const totalScore = useSelector((state) => state.game.totalScore);
  const [socket, setSocket] = useState();
  const [battleUserProfile, setBattleUserProfile] = useState({});
  const [battleUserResults, setBattleUserResults] = useState({});
  const [ready, setReady] = useState(false);
  const [shouldNavigate, setShouldNavigate] = useState(false);

  const handleExit = useCallback(() => {
    setShouldNavigate(true);
    dispatch(resetRecords());
  }, [dispatch]);

  const localStorageUser = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const { displayName, photoURL, uid } = auth.currentUser
    ? auth.currentUser
    : {
        displayName: localStorageUser?.name,
        photoURL: null,
        uid: localStorageUser?.uid,
      };

  useEffect(() => {
    if (displayName && uid && resultId) {
      const socketClient = io(`${process.env.REACT_APP_SOCKET_URL}/results/`, {
        cors: {
          origin: "*",
          methods: ["GET", "POST"],
        },
        query: { displayName, photoURL, uid, resultId },
      });
      setSocket(socketClient);

      return () => {
        socketClient.disconnect();
      };
    }
  }, [resultId, displayName, photoURL, uid]);

  const sendResults = useCallback(() => {
    if (resultId && totalScore && comboResults && socket) {
      socket?.emit(SEND_RESULTS, comboResults, totalScore);
    }
  }, [comboResults, resultId, socket, totalScore]);

  setInterval(() => {
    sendResults();
  }, 250);

  useEffect(() => {
    const deleteBattle = async () => {
      const roomId = resultId;
      const jwt = localStorage.getItem("jwt");

      const response = await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/api/rooms/${roomId}`,
        {
          headers: {
            authorization: `Bearer ${jwt}`,
          },
        },
      );

      if (response.status === 204) {
        setReady(true);
      }
    };

    deleteBattle();
  }, [resultId]);

  useEffect(() => {
    if (socket) {
      const receiveResultsListener = (comboResults, totalScore, user) => {
        if (totalScore !== 0 && comboResults.excellent !== 0 && user) {
          setBattleUserResults(comboResults);
          setBattleUserProfile({ totalScore, user });
        }
      };

      socket.on(RECEIVE_RESULTS, receiveResultsListener);

      return () => {
        socket.off(RECEIVE_RESULTS, receiveResultsListener);
      };
    }
  }, [socket]);

  return (
    <BattleResultsContainer>
      {shouldNavigate && ready && <Navigate to="/" />}
      <PageTitle>Results</PageTitle>
      <ResultsWrapper>
        <ResultPanel>
          <Winner>
            {totalScore < battleUserProfile?.totalScore ? "Loser" : "Winner"}
          </Winner>
          <UserContainer>
            {photoURL ? <UserImage src={photoURL} /> : <Emoji>🥳</Emoji>}
            <ResultsBox>{displayName}</ResultsBox>
          </UserContainer>
          {Object.keys(comboResults).map((key) => (
            <RecordsContainer key={key}>
              <ResultsBox>{key}</ResultsBox>
              <Score>{comboResults[key]}</Score>
            </RecordsContainer>
          ))}
          <StyledHr />
          <RecordsContainer>
            <ResultsBox>TotalScore: </ResultsBox>
            <Score>{totalScore}</Score>
          </RecordsContainer>
        </ResultPanel>
        <ResultPanel>
          <Winner>
            {battleUserProfile?.totalScore > totalScore ? "Winner" : "Loser"}
          </Winner>
          {battleUserProfile ? (
            <>
              {" "}
              <UserContainer>
                {battleUserProfile?.user?.photoURL !== "null" ? (
                  <UserImage src={battleUserProfile?.user?.photoURL} />
                ) : (
                  <Emoji>🥸</Emoji>
                )}
                <ResultsBox>
                  {battleUserProfile.user?.displayName !== null &&
                    battleUserProfile?.user?.displayName}
                </ResultsBox>
              </UserContainer>
              {battleUserResults.excellent !== 0 &&
                Object.keys(battleUserResults).map((key) => (
                  <RecordsContainer key={key}>
                    <ResultsBox>{key}</ResultsBox>
                    <Score>{battleUserResults[key]}</Score>
                  </RecordsContainer>
                ))}
              {battleUserProfile?.totalScore ? <StyledHr /> : null}
              <RecordsContainer>
                {battleUserProfile?.totalScore ? (
                  <ResultsBox>TotalScore: </ResultsBox>
                ) : null}
                <Score>
                  {battleUserProfile && battleUserProfile?.totalScore}
                </Score>
              </RecordsContainer>
            </>
          ) : null}
        </ResultPanel>
      </ResultsWrapper>
      <ButtonContainer>
        <ActionButton type="button">기록하기</ActionButton>
        <ActionButton type="button" onClick={() => handleExit()}>
          나가기
        </ActionButton>
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

const Emoji = styled.div`
  height: 100%;
  font-size: 5em;
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
