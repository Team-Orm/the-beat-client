import { io } from "socket.io-client";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { useSelector } from "react-redux";
import GameController from "../GameController";
import { auth } from "../../features/api/firebaseApi";
import { UPDATE_USER, USER_JOINED, USER_LEAVE } from "../../store/constants";

export default function BattleRoom() {
  const [song, setSong] = useState({});
  const [room, setRoom] = useState({});
  const [socket, setSocket] = useState();
  const [countdown, setCountdown] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [currentUserList, setCurrentUserList] = useState([]);
  const [newUser, setNewUser] = useState({});

  const audioRef = useRef(null);
  const { roomId } = useParams();
  const score = useSelector((state) => state.game.score);

  const { displayName, photoURL, uid } = newUser;

  const handleStart = () => {
    setIsCountingDown(true);
    const countdownTimer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 2) {
          setIsPlaying(true);
        }

        return prevCountdown - 1;
      });
    }, 1000);
    setTimeout(() => {
      clearInterval(countdownTimer);
      audioRef.current.src = song.audioURL;
      audioRef.current.play();
    }, 3000);
  };

  useEffect(() => {
    if (auth && auth.currentUser) {
      const { displayName, photoURL, uid } = auth.currentUser;

      setNewUser({
        displayName,
        photoURL,
        uid,
      });
    }
  }, []);

  useEffect(() => {
    const socketClient = io(`${process.env.REACT_APP_SOCKET_URL}/battles/`, {
      query: {
        roomId,
        name: displayName,
        picture: photoURL,
        uid,
      },
    });
    setSocket(socketClient);

    return () => {
      socketClient.disconnect();
    };
  }, [displayName, photoURL, roomId, uid]);

  useEffect(() => {
    const getSong = async () => {
      const jwt = localStorage.getItem("jwt");
      console.log(jwt);
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/rooms/${roomId}`,
      );

      if (response.status === 200) {
        setRoom(response.data.room);
        setSong(response.data.song);
      }
    };

    getSong();
  }, [roomId]);

  useEffect(() => {
    if (socket) {
      socket.on(UPDATE_USER, (currentUserList) => {
        setCurrentUserList(currentUserList);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on(USER_JOINED, (user) => {
        setCurrentUserList((prevUserList) => [...prevUserList, user]);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on(USER_LEAVE, (user) => {
        setCurrentUserList((prevUserList) =>
          prevUserList.filter((users) => users.uid !== user.uid),
        );
      });
    }
  }, [socket]);
  return (
    <Container song={song}>
      <AudioContainer ref={audioRef} />
      {!isCountingDown && (
        <StartButton onClick={handleStart}>Start</StartButton>
      )}
      {isCountingDown && countdown > 0 && <Count>{countdown}</Count>}
      <BattleRoomContainer>
        <BattleUserContainer>
          <Controller>
            <GameController isPlaying={isPlaying} />
          </Controller>
        </BattleUserContainer>
        <BattleUserContainer>
          <Controller>
            <GameController isPlaying={isPlaying} />
          </Controller>
        </BattleUserContainer>
      </BattleRoomContainer>
      <BottomContainer>
        <ScoreContainer>
          <Records>
            <div>{room?.createdBy && auth?.currentUser?.displayName}</div>
            <div>score: {score}</div>
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
  background-image: ${(props) =>
    props.song?.imageURL ? `url(${props.song.imageURL})` : "none"};
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
  flex: 9;
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

const BottomContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
`;

const ScoreContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50vw;
  background-color: transparent;
  font-size: 2em;
  color: black;
  border: 5px solid white;
`;

const Records = styled.div`
  display: flex;
  justify-content: space-between;
  width: 80%;
  color: white;
`;
