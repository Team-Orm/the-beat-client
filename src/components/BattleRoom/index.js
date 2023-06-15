import { io } from "socket.io-client";
import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { auth } from "../../features/api/firebaseApi";

import GameController from "../GameController";
import AudioVisualizer from "../AudioVisualizer";

import {
  DELETE_ROOM,
  OPPONENT_KEY_PRESS,
  OPPONENT_KEY_RELEASE,
  RECEIVE_BATTLES,
  RECEIVE_DELETE,
  RECEIVE_OPPONENT_KEY_PRESS,
  RECEIVE_OPPONENT_KEY_RELEASE,
  RECEIVE_READY,
  RECEIVE_START,
  RECEIVE_USER,
  ROOM_FULL,
  SEND_BATTLES,
  SEND_CONNECT,
  SEND_READY,
  SEND_START,
  SEND_USER,
  USER_LEFT,
} from "../../store/constants";

export default function BattleRoom({
  initialReady = false,
  initialCountingDown = false,
}) {
  const navigate = useNavigate();
  const { roomId } = useParams();

  const [room, setRoom] = useState({
    song: {},
    notes: [],
  });
  const [socket, setSocket] = useState();
  const [countdown, setCountdown] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(initialCountingDown);
  const [battleUser, setBattleUser] = useState({});
  const [battleUserReady, setBattleUserReady] = useState(initialReady);
  const [battleUserResults, setbattleUserResults] = useState({});
  const [currentUserReady, setCurrentUserReady] = useState(false);
  const [activeKeys, setActiveKeys] = useState([]);
  const [isSinglePlayer, setIsSinglePlayer] = useState(false);
  const location = useLocation();

  const score = useSelector((state) => state.game.score);
  const combo = useSelector((state) => state.game.currentCombo);
  const word = useSelector((state) => state.game.word);

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

  const sendKeyPressToOpponents = (key) => {
    socket.emit(OPPONENT_KEY_PRESS, key);
  };

  const sendKeyReleaseToOpponents = (key) => {
    socket.emit(OPPONENT_KEY_RELEASE, key);
  };

  const handleTimerAndCount = useCallback(() => {
    setIsCountingDown(true);

    const countdownTimer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(countdownTimer);
      setIsPlaying(true);
    }, 3000);
  }, []);

  const handleStart = () => {
    socket.emit(SEND_START);
    setBattleUserReady(!battleUserReady);
    setIsCountingDown(true);

    handleTimerAndCount();
  };

  const handleReady = () => {
    socket.emit(SEND_READY);
    setCurrentUserReady(!currentUserReady);
  };

  const handleExit = useCallback(async () => {
    if (uid === room?.uid) {
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
          socket.emit(DELETE_ROOM);
        }
      } catch (err) {
        navigate("/error", {
          state: {
            status: err.response?.status,
            text: err.response?.statusText,
            message: err.resopnse?.data?.message,
          },
        });
      }
    }

    navigate("/");
  }, [navigate, room?.uid, roomId, socket, uid]);

  useEffect(() => {
    const getSong = async () => {
      try {
        const jwt = localStorage.getItem("jwt");

        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/rooms/${roomId}`,
          {
            headers: {
              authorization: `Bearer ${jwt}`,
              modes: location?.pathname,
            },
          },
        );

        if (response.status === 200) {
          const { room, song, note } = response.data;

          setRoom({ ...room, song, notes: note.note });
        }
      } catch (err) {
        navigate("/error", {
          state: {
            status: err.response?.status,
            text: err.response?.statusText,
            message: err.response?.data?.message,
          },
        });
      }
    };

    getSong();
  }, [navigate, roomId]);

  useEffect(() => {
    if (isSinglePlayer) return;

    const interval = setInterval(() => {
      if (!isPlaying) {
        socket?.emit(SEND_USER);
        socket?.emit(SEND_CONNECT);
      }
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, [isPlaying, isSinglePlayer, socket]);

  useEffect(() => {
    if (isSinglePlayer) return;

    socket?.on(RECEIVE_USER, (currentUserArray) => {
      const battleUser = Object.values(currentUserArray).filter(
        (u) => u.uid !== uid,
      );

      setBattleUser(battleUser[0]);
    });

    socket?.emit(SEND_BATTLES, score, combo, word);
    socket?.on(RECEIVE_BATTLES, (score, combo, word) => {
      setbattleUserResults({ score, combo, word });
    });

    socket?.on(USER_LEFT, (uid) => {
      if (uid === room.uid) {
        handleExit();
      }
      setBattleUser(null);
    });

    socket?.on(RECEIVE_OPPONENT_KEY_PRESS, (key) => {
      setActiveKeys((prevActiveKeys) => [...prevActiveKeys, key]);
    });
    socket?.on(RECEIVE_OPPONENT_KEY_RELEASE, (key) => {
      setActiveKeys((prevActiveKeys) => {
        return prevActiveKeys.filter((activeKey) => activeKey !== key);
      });
    });

    socket?.on(RECEIVE_READY, () => {
      setBattleUserReady(!battleUserReady);
    });

    socket?.on(RECEIVE_START, () => {
      setCurrentUserReady(false);
      handleTimerAndCount();
    });

    socket?.on(RECEIVE_DELETE, () => {
      navigate("/");
      alert("방을 만든 유저가 나갔습니다.");
    });

    socket?.on(ROOM_FULL, () => {
      alert("방이 가득 차 있습니다.");
      navigate("/");
    });
  }, [
    combo,
    displayName,
    photoURL,
    battleUserReady,
    score,
    socket,
    uid,
    word,
    room.uid,
    navigate,
    handleExit,
    handleTimerAndCount,
    isSinglePlayer,
  ]);

  useEffect(() => {
    if (isSinglePlayer) return;

    const socketClient = io(`${process.env.REACT_APP_SOCKET_URL}/battles/`, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
      query: { displayName, photoURL, uid, roomId },
    });
    setSocket(socketClient);

    return () => {
      if (socketClient) {
        socketClient.disconnect();
      }
    };
  }, [displayName, isSinglePlayer, photoURL, roomId, uid]);

  useEffect(() => {
    if (location.pathname.includes("single")) {
      setIsSinglePlayer(true);
    }
  }, [location?.pathname]);

  return (
    <Container song={room?.song}>
      <AudioVisualizer
        song={room?.song}
        isPlaying={isPlaying}
        data-testid="audio-visualizer"
      />
      {!isPlaying && (
        <OutButton
          type="button"
          onClick={handleExit}
          data-testid="exit-button"
          data-pt="exit-button"
        >
          나가기
        </OutButton>
      )}
      {!isCountingDown && room?.uid === uid && (
        <StartButton
          onClick={handleStart}
          disabled={!isSinglePlayer && !battleUserReady}
          data-testid="start-button"
          data-pt="start-container"
        >
          Start
        </StartButton>
      )}
      {!isCountingDown && room?.uid !== uid && !battleUserReady && (
        <StartButton onClick={handleReady} data-pt="ready-container">
          Ready
        </StartButton>
      )}
      {isCountingDown && countdown > 0 && (
        <Count data-pt="count-down" data-testid="countdown">
          {countdown}
        </Count>
      )}
      <BattleRoomContainer data-testid="battleRoom-Container">
        <BattleUserContainer>
          <Controller>
            {room?.uid !== uid && currentUserReady && (
              <Ready data-pt="ready-left-container">Ready</Ready>
            )}
            <GameController
              isCurrentUser
              isPlaying={isPlaying}
              sendKeyPressToOpponents={sendKeyPressToOpponents}
              sendKeyReleaseToOpponents={sendKeyReleaseToOpponents}
              initialNotes={room?.notes}
            />
          </Controller>
        </BattleUserContainer>
        <BattleUserContainer>
          <Controller hidden={isSinglePlayer}>
            {battleUserReady && (
              <Ready data-pt="ready-right-container">Ready</Ready>
            )}
            <GameController
              isCurrentUser={false}
              isPlaying={isPlaying}
              battleUserKeys={activeKeys}
              battleUserResults={battleUserResults}
              initialNotes={room?.notes}
              data-pt="battle-user"
            />
          </Controller>
        </BattleUserContainer>
      </BattleRoomContainer>
      (
      <BottomContainer data-testid="battleRoom-Container">
        <ScoreContainer data-testid="score-container">
          <Records>
            <ProfileContainer>
              <Profile data-pt="create-user">
                {photoURL ? (
                  <Photo src={photoURL} alt="Me" />
                ) : (
                  <Imoge>🤓</Imoge>
                )}
                {displayName}
              </Profile>
              <div data-pt="current-user-score">score: {score}</div>
            </ProfileContainer>
          </Records>
        </ScoreContainer>
        <ScoreContainer data-testid="score-container">
          {!isSinglePlayer && (
            <Records>
              <ProfileContainer>
                <div data-pt="battle-user-score">
                  score:{" "}
                  {battleUserResults?.score ? battleUserResults.score : 0}
                </div>
                <Profile data-pt="battle-user">
                  {battleUser?.displayName}
                  {battleUser?.photoURL !== "null" && battleUser?.photoURL ? (
                    <Photo src={battleUser?.photoURL} alt="battleUser" />
                  ) : (
                    <Imoge>🙅🏼</Imoge>
                  )}
                </Profile>
              </ProfileContainer>
            </Records>
          )}
        </ScoreContainer>
      </BottomContainer>
      )
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

  visibility: ${({ hidden }) => (hidden ? "hidden" : "visible")};
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

const Imoge = styled.div`
  font-size: 3vw;
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
  font-size: 2.5vw;
  width: 100%;
  height: 80%;
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
