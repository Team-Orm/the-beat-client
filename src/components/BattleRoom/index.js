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
  const [ready, setReady] = useState(false);
  const [myReady, setMyReady] = useState(false);
  const [activeKeys, setActiveKeys] = useState([]);

  const { displayName, photoURL, uid } = auth.currentUser
    ? auth.currentUser
    : { displayName: null, photoURL: null, uid: null };

  const { roomId } = useParams();
  const score = useSelector((state) => state.game.score);
  const combo = useSelector((state) => state.game.currentCombo);

  const handleKeyPress = (key) => {
    socket.emit("opponent-key-press", key);
  };

  const handleKeyRelease = (key) => {
    socket.emit("opponent-key-release", key);
  };

  const handleOut = async () => {
    if (auth?.currentUser?.uid === room?.uid) {
      try {
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
          socket.emit("delete-room");
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
    }

    navigate("/");
  };

  const handleStart = () => {
    socket.emit("send-start");
    setIsCountingDown(true);
    setReady(!ready);

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

  const handleReady = () => {
    socket.emit("send-ready");
    setMyReady(!myReady);
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

    socket?.on("receive-opponent-key-press", (key) => {
      setActiveKeys((prevActiveKeys) => [...prevActiveKeys, key]);
    });

    socket?.on("receive-opponent-key-release", (key) => {
      setActiveKeys((prevActiveKeys) => {
        return prevActiveKeys.filter((activeKey) => activeKey !== key);
      });
    });

    socket?.on("receive-delete", () => {
      navigate("/");
      alert("방을 만든 유저가 나갔습니다.");
    });

    socket?.on("receive-ready", () => {
      setReady(!ready);
    });

    socket?.on("receive-start", () => {
      setIsCountingDown(true);
      setMyReady(false);

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
    });

    socket?.on("room-full", () => {
      alert("방이 가득 차 있습니다.");
      navigate("/");
    });
  }, [combo, displayName, navigate, photoURL, ready, score, socket]);

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
      <OutButton type="button" onClick={handleOut}>
        나가기
      </OutButton>
      {!isCountingDown && room?.uid === auth?.currentUser?.uid && (
        <StartButton onClick={handleStart} disabled={!ready}>
          Start
        </StartButton>
      )}
      {!isCountingDown && room?.uid !== auth?.currentUser?.uid && !ready && (
        <StartButton onClick={handleReady}>Ready</StartButton>
      )}
      {isCountingDown && countdown > 0 && <Count>{countdown}</Count>}
      <BattleRoomContainer>
        <BattleUserContainer>
          <Controller>
            {room?.uid !== auth?.currentUser?.uid && myReady && (
              <Ready>Ready</Ready>
            )}
            <GameController
              isPlaying={isPlaying}
              isRender={render}
              handleKeyPress={handleKeyPress}
              handleKeyRelease={handleKeyRelease}
              isCurrentUser
            />
          </Controller>
        </BattleUserContainer>
        <BattleUserContainer>
          <Controller>
            {ready && <Ready>Ready</Ready>}
            <GameController
              isPlaying={isPlaying}
              isRender={render}
              isCurrentUser={false}
              otherKeys={activeKeys}
            />
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
  position: relative;
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

const StartButton = styled.button`
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
  background-color: transparent;

  :hover {
    ${({ disabled }) =>
      !disabled &&
      `
      color: greenyellow;
      border: 5px solid greenyellow;
    `}
  }

  ${({ disabled }) =>
    disabled &&
    `
    cursor: not-allowed;
    opacity: 0.6;
  `}
`;

const OutButton = styled.button`
  position: absolute;
  bottom: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 4em;
  padding: 10px 20px;
  border: 5px solid white;
  border-radius: 20px;
  color: white;
  background-color: transparent;

  :hover {
    color: greenyellow;
    border: 5px solid greenyellow;
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

const Ready = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: transparent;
  border: 5px solid greenyellow;
  font-size: 5em;
  z-index: 12;
  color: greenyellow;
  padding: 10px 20px;
  border-radius: 10px;
`;

const ProfileContainer = styled.div`
  display: flex;
  position: relative;
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
