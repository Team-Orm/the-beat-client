import { io } from "socket.io-client";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { auth } from "../../features/api/firebaseApi";

import GameController from "../GameController";
import AudioVisualizer from "../AudioVisualizer";

export default function BattleRoom() {
  const navigate = useNavigate();

  const [song, setSong] = useState({});
  const [room, setRoom] = useState({});
  const [socket, setSocket] = useState();
  const [countdown, setCountdown] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [battleUser, setBattleUser] = useState({});
  const [render, setRender] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);

  const { displayName, photoURL, uid } = auth.currentUser
    ? auth.currentUser
    : { displayName: null, photoURL: null, uid: null };

  const { roomId } = useParams();
  const score = useSelector((state) => state.game.score);
  const combo = useSelector((state) => state.game.currentCombo);

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
  socket?.emit("send-user");

  useEffect(() => {
    socket?.emit("send-battles", score, combo);

    socket?.on("receive-user", (currentUserArray) => {
      const battleUser = Object.values(currentUserArray).filter(
        (u) => u.uid !== auth?.currentUser?.uid,
      );

      setBattleUser(battleUser[0]);
    });

    socket?.emit("send-connect");

    socket?.on("user-left", () => {
      setBattleUser(null);
    });

    socket?.on("room-full", () => {
      alert("방이 가득 차 있습니다.");
      navigate("/");
    });
  }, [combo, displayName, navigate, photoURL, score, socket]);

  useEffect(() => {
    const socketClient = io(`${process.env.REACT_APP_SOCKET_URL}/battles/`, {
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
    <Container song={song}>
      <AudioVisualizer song={song} isPlaying={isPlaying} />
      {!isCountingDown && room?.uid === auth?.currentUser?.uid && (
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
            <ProfileContainer>
              <Profile>
                <Photo src={auth?.currentUser?.photoURL} alt="Me" />
                {auth?.currentUser?.displayName}
              </Profile>
              score: {score}
            </ProfileContainer>
          </Records>
        </ScoreContainer>
        <ScoreContainer>
          <Records>
            <ProfileContainer>
              <div>score: {score}</div>
              {battleUser?.photoURL ? (
                <Profile>
                  {battleUser?.displayName}
                  <Photo src={battleUser.photoURL} alt="battleUser" />
                </Profile>
              ) : (
                "🙅🏼"
              )}
            </ProfileContainer>
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
  padding: 0;C
`;

const Count = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 5em;
  padding: 10px 20px;
  top: 50%;
  left: 50%;
  color: white;
  transform: translate(-50%, -50%);
  z-index: 10;
`;

const Photo = styled.img`
  height: 45px;
  width: 45px;
  border-radius: 50%;
  object-fit: cover;
`;

const StartButton = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 5em;
  padding: 10px 20px;
  border: 5px solid white;
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

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 10px;
`;

const Profile = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 50%;
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
