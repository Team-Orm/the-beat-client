/* eslint-disable react/no-array-index-key */
import { io } from "socket.io-client";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import GameController from "../GameController";

export default function BattleRoom() {
  const params = useParams();
  const [songData, setSongData] = useState({});
  const [roomData, setRoomData] = useState({});
  const [socket, setSocket] = useState();
  const [countdown, setCountdown] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const audioRef = useRef(null);
  const { roomId } = useParams();

  useEffect(() => {
    const socketClient = io(`http://localhost:4000/battles/${roomId}`, {
      query: { roomId },
    });
    setSocket(socketClient);

    return () => {
      socketClient.disconnect();
    };
  }, []);

  useEffect(() => {
    async function getSong() {
      const response = await axios.get(
        `http://localhost:8000/api/rooms/${roomId}`,
      );

      if (response.status === 200) {
        setSongData(response.data.song);
        setRoomData(response.data.room);
      }
    }

    getSong();
  }, []);

  const handleStart = () => {
    setIsCountingDown(true);
    const countdownTimer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(countdownTimer);
      setIsPlaying(true);
      audioRef.current.src = songData.audioURL;
      audioRef.current.play();
    }, 3000);
  };

  return (
    <Container>
      <AudioContainer ref={audioRef} />
      {!isCountingDown && (
        <StartButton onClick={handleStart}>Start</StartButton>
      )}
      {isCountingDown && countdown > 0 && <Count>{countdown}</Count>}
      <BattleRoomContainer>
        <BattleUserContainer>
          <div>
            <GradingText>Good</GradingText>
            <CountText>12</CountText>
          </div>
          <Controller>
            <GameController isPlaying={isPlaying} />
          </Controller>
        </BattleUserContainer>
        <BattleUserContainer>
          <div>
            <GradingText>Good</GradingText>
            <CountText>12</CountText>
          </div>
          <Controller>
            <GameController isPlaying={isPlaying} />
          </Controller>
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
  position: relative;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  background-image: url("/image2.png");
  background-size: cover;
  background-position: center;
  box-sizing: border-box;
`;

const AudioContainer = styled.audio`
  display: hidden;
`;

const Controller = styled.div`
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
`;

const Count = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2em;
  padding: 10px 20px;
  top: 50%;
  left: 50%;
  color: white;
  transform: translate(-50%, -50%);
  z-index: 10;
`;

const StartButton = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2em;
  padding: 10px 20px;
  border: 2px solid white;
  border-radius: 20px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  z-index: 10;

  :hover {
    color: greenyellow;
    border: 2px solid greenyellow;
  }
`;

const BattleRoomContainer = styled.div`
  display: flex;
  flex: 11;
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

const BottomContainer = styled.div`
  flex: 1;
  display: flex;
  /* align-items: center; */
  justify-content: space-between;
`;

const ScoreContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
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