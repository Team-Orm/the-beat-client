import { io } from "socket.io-client";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { auth } from "../../features/api/firebaseApi";
import { UPDATE_USER, USER_JOINED, USER_LEAVE } from "../../store/constants";

import GameController from "../GameController";
import AudioVisualizer from "../AudioVisualizer";

export default function BattleRoom() {
  const navigate = useNavigate();

  const [song, setSong] = useState({});
  const [room, setRoom] = useState({});
  const [socket, setSocket] = useState();
  const [countdown, setCountdown] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [render, setRender] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [currentUserList, setCurrentUserList] = useState([]);
  const [newUser, setNewUser] = useState({});

  const { roomId } = useParams();
  const score = useSelector((state) => state.game.score);

  const { displayName, photoURL, uid } = newUser;

  const handleStart = () => {
    setIsCountingDown(true);
    const countdownTimer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 2) {
          setRender(true);
        }

        return prevCountdown - 1;
      });
    }, 1000);

    setTimeout(() => {
      clearInterval(countdownTimer);
      setIsPlaying(true);
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
      try {
        const jwt = localStorage.getItem("jwt");

        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/rooms/${roomId}`,
          {
            headers: {
              authorization: `Bearer ${jwt}`,
            },
          },
        );

        if (response.status === 200) {
          setRoom(response.data.room);
          setSong(response.data.song);
        }
      } catch (err) {
        navigate("/error", {
          state: {
            status: err.response.status,
            text: err.response.statusText,
            message: err.response.data.message,
          },
        });
      }
    };

    getSong();
  }, [navigate, roomId]);

  useEffect(() => {
    if (!socket) return;

    const handleUpdateUser = (currentUserList) => {
      setCurrentUserList(currentUserList);
    };

    const handleUserJoined = (user) => {
      setCurrentUserList((prevUser) => [...prevUser, user]);
    };

    const handleUserLeave = (user) => {
      setCurrentUserList((prevUserArray) =>
        prevUserArray.filter((prevUser) => prevUser.uid !== user.uid),
      );
    };

    socket.on(UPDATE_USER, handleUpdateUser);
    socket.on(USER_JOINED, handleUserJoined);
    socket.on(USER_LEAVE, handleUserLeave);

    return () => {
      socket.off(UPDATE_USER, handleUpdateUser);
      socket.off(USER_JOINED, handleUserJoined);
      socket.off(USER_LEAVE, handleUserLeave);
    };
  }, [socket]);

  return (
    <Container song={song}>
      <AudioVisualizer song={song} isPlaying={isPlaying} />
      {!isCountingDown && (
        <StartButton onClick={handleStart}>Start</StartButton>
      )}
      {isCountingDown && countdown > 0 && <Count>{countdown}</Count>}
      <BattleRoomContainer>
        <BattleUserContainer>
          <Controller>
            <GameController isPlaying={isPlaying} isRender={render} />
          </Controller>
        </BattleUserContainer>
        <BattleUserContainer>
          <Controller>
            <GameController isPlaying={isPlaying} isRender={render} />
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
