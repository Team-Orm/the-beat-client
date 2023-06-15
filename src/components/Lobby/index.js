import { io } from "socket.io-client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { auth } from "../../features/api/firebaseApi";
import {
  UPDATE_ROOMS,
  SEND_CHAT,
  BROADCAST_CHAT,
  UPDATE_USER,
  LOBBY_ROOMS,
  RECEIVE_LOBBY_USERS,
  FROM_BATTLE,
} from "../../store/constants";

export default function Lobby() {
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [currentUserList, setCurrentUserList] = useState([]);
  const [roomsList, setRoomsList] = useState([]);
  const [chatMessage, setChatMessage] = useState("");
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [usersInRooms, setUsersInRooms] = useState({});

  const chatListRef = useRef(null);
  const localStorageUser = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const { accessToken, displayName, photoURL, uid } = auth.currentUser
    ? auth.currentUser
    : {
        accessToken: localStorageUser?.token,
        displayName: localStorageUser?.name,
        photoURL: null,
        uid: localStorageUser?.uid,
      };

  const handleChatMessageChange = (e) => {
    setChatMessage(e.target.value);
  };

  const handleSendMessage = useCallback(
    (e) => {
      e.preventDefault();

      if (chatMessage !== "" && socket) {
        socket.emit(SEND_CHAT, {
          user: displayName,
          chat: chatMessage,
        });

        setChatMessage("");
      }
    },
    [chatMessage, displayName, socket],
  );

  const handleRoomClick = useCallback(
    (roomId) => {
      const targetUser = usersInRooms[roomId];

      if (targetUser && Object.keys(targetUser).length === 2) {
        alert("방이 가득 차 있습니다.?");
      }

      navigate(`/battles/${roomId}`);
    },
    [usersInRooms, navigate],
  );

  const handleMakeRoom = () => {
    try {
      navigate("/battles/new");
    } catch (err) {
      if (err.response.status) {
        navigate("/error", {
          state: {
            status: err.response?.status,
            text: err.response?.statusText,
            message: err.response?.data?.message,
          },
        });
      }
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/users/logout`,
      );

      if (response.status === 204) {
        localStorage.removeItem("jwt");
        localStorage.removeItem("user");
        auth.signOut();

        return navigate("/login");
      }

      throw new Error(response);
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

  const scrollToBottom = useCallback(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  }, [chatListRef]);

  useEffect(() => {
    scrollToBottom();
  }, [receivedMessages, scrollToBottom]);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");

    if (!jwt) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const updateRooms = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/rooms`,
        );

        if (response.status === 200) {
          const newRooms = await response.data.rooms;
          return setRoomsList(() => newRooms);
        }

        throw new Error(response);
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

    updateRooms();
  }, [setRoomsList, navigate]);

  useEffect(() => {
    const getTokenAndSetUser = async () => {
      try {
        if (auth && auth.currentUser) {
          const response = await axios.post(
            `${process.env.REACT_APP_SERVER_URL}/api/users/login`,
            { accessToken, displayName, uid, photoURL },
          );

          if (response.status === 201) {
            return localStorage.setItem("jwt", response.data.token);
          }

          throw new Error(response);
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

    getTokenAndSetUser();
  }, [accessToken, displayName, photoURL, uid, navigate]);

  useEffect(() => {
    socket?.emit(RECEIVE_LOBBY_USERS);

    socket?.on(UPDATE_USER, (user) => {
      setCurrentUserList(() => user);
    });

    socket?.on(LOBBY_ROOMS, (rooms) => {
      setUsersInRooms(() => rooms);
    });

    socket?.on(UPDATE_ROOMS, (rooms) => {
      setRoomsList(() => rooms);
    });

    socket?.on(BROADCAST_CHAT, (user, chat) => {
      setReceivedMessages((prevMessages) => [...prevMessages, { user, chat }]);
    });

    socket?.on(FROM_BATTLE, (updatedRooms) => {
      setUsersInRooms(() => updatedRooms);
    });
  }, [socket]);

  useEffect(() => {
    const socketClient = io(`${process.env.REACT_APP_SOCKET_URL}`, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
      query: { displayName, photoURL, uid },
      reconnection: true,
      reconnectionDelay: 1000,
    });
    setSocket(socketClient);

    return () => {
      socketClient.disconnect();
    };
  }, [displayName, photoURL, uid]);

  return (
    <>
      <Background data-pt="element-after-login">
        <HeaderContainer data-testid="header-container">
          <LeftHeader>Room</LeftHeader>
          <RightHeader>User</RightHeader>
        </HeaderContainer>
        <Container data-testid="lobby-container">
          <LeftContainer>
            <RoomsContainer>
              <RoomsLists>
                {roomsList.length
                  ? roomsList.map(({ _id, createdBy, song, mode }, index) => {
                      return (
                        mode !== "single" && (
                          <Room key={_id} onClick={() => handleRoomClick(_id)}>
                            <RoomName
                              data-pt={`room-container-${index}`}
                            >{`${createdBy} ${
                              usersInRooms[_id]?.users.length
                                ? usersInRooms[_id]?.users.length
                                : 1
                            } / 2`}</RoomName>
                            <RoomSong>{song?.title}</RoomSong>
                          </Room>
                        )
                      );
                    })
                  : null}
              </RoomsLists>
              <RoomButton onClick={() => navigate("/records")}>
                기록실
              </RoomButton>
            </RoomsContainer>
            <ChatContainer>
              <ChatsHead>Chats</ChatsHead>
              <ChatList ref={chatListRef}>
                {receivedMessages.map(({ user, chat }, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <Chats key={user + chat + index}>
                    {user}: {chat}
                  </Chats>
                ))}
              </ChatList>
            </ChatContainer>
            <ChatInputContainer onSubmit={handleSendMessage}>
              <ChatMessageInput
                type="text"
                value={chatMessage}
                onChange={handleChatMessageChange}
              />
              <ChatSubmitButton>Send</ChatSubmitButton>
            </ChatInputContainer>
          </LeftContainer>
          <RightContainer>
            <UserList>
              {currentUserList &&
                currentUserList?.map(({ photoURL, displayName }, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <User key={photoURL + index}>
                    {photoURL !== "null" ? (
                      <ProfilePicture src={photoURL} alt="😃" />
                    ) : (
                      "😃"
                    )}
                    <ProfileText data-pt={`user-container-${index}`}>
                      {displayName}
                    </ProfileText>
                  </User>
                ))}
            </UserList>
            <RightBottom>
              <ActionButton
                type="button"
                onClick={handleMakeRoom}
                data-pt="create-room"
              >
                방 만들기
              </ActionButton>
              <ActionButton
                type="button"
                onClick={handleLogout}
                data-pt="logout-button"
              >
                Logout
              </ActionButton>
            </RightBottom>
          </RightContainer>
        </Container>
      </Background>
      <MobileBackground>
        <MobileMessage>
          <div>Sorry, We don&apos;t support our service</div>
          <div>on Mobile or Tablet.</div>
          <div>Try on Chrome please.</div>
        </MobileMessage>
      </MobileBackground>
    </>
  );
}

const Background = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100vh;
  width: 100vw;
  background-image: url("/lobby.png");
  background-size: cover;
  background-position: center;

  @media screen and (max-width: 1023px) {
    display: none;
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin: -25px 0 0 0;
  height: calc(100vh - 90px);
  width: 100vw;
  color: gray;
`;

const HeaderContainer = styled.div`
  display: flex;
  margin: 20px 20px 0 20px;
  height: 70px;
  align-items: flex-end;
`;

const LeftHeader = styled.header`
  flex: 6;
  display: flex;
  justify-content: flex-start;
  font-size: 2.5em;
  margin: 0 0 0 100px;
  color: gray;
`;

const RightHeader = styled.header`
  flex: 3;
  font-size: 2.5em;
  margin: 0 0 0 20px;
  color: gray;
`;

const LeftContainer = styled.div`
  flex: 6;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  height: 95%;
  padding: 10px;
  margin: 80px;
`;

const RoomsContainer = styled.div`
  position: relative;
  flex: 5;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  color: gray;
`;

const RoomsLists = styled.div`
  flex: 4;
  display: flex;
  flex-direction: column;
  margin: 20px;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.15);
  border: 2.5px solid white;
  border-radius: 20px;
`;

const Room = styled.div`
  position: relative;
  display: flex;
  width: 80%;
  margin: 15px 20px;
  padding: 20px 40px;
  border-radius: 30px;
  background-color: rgb(70, 70, 70);
  color: white;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    box-shadow: -8px -8px 16px rgba(255, 255, 255, 0.1),
      8px 8px 16px rgba(0, 0, 0, 0.6);
    transform: translateY(-5px);
  }
`;

const RoomName = styled.div`
  flex: 6;
`;

const RoomSong = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: flex-end;
  padding: 20px 40px;
  border-top-right-radius: 30px;
  border-bottom-right-radius: 30px;
  background-color: white;
  color: black;
`;

const RoomButton = styled.button`
  position: absolute;
  bottom: -12.5%;
  right: 5%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 10vw;
  height: 6vh;
  background-color: transparent;
  border-radius: 10px;
  border: 3px solid rgba(0, 0, 0, 0.5);
  font-size: 2em;
  color: gray;

  :hover {
    color: skyBlue;
    border: 3px solid skyBlue;
  }
`;

const ChatContainer = styled.div`
  flex: 4;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  color: gray;
  height: 300px;
`;

const ChatsHead = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  padding: 0 40px;
  font-size: 2.5em;
`;

const ChatList = styled.div`
  display: flex;
  flex-direction: column;
  flex: 4;
  margin: 20px;
  padding: 20px;
  max-height: calc(100% - 30px);
  background-color: rgba(0, 0, 0, 0.15);
  border: 2.5px solid white;
  border-radius: 20px;
  overflow-y: auto;
`;

const Chats = styled.div`
  margin: 0 15px;
  display: flex;
  width: 80%;
  min-height: 30px;
  align-items: center;
  color: black;
`;

const ChatInputContainer = styled.form`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 20px;
  padding: 20px;
  height: 5%;
  border-radius: 10px;
  box-shadow: 0px 1px 5px 1px rgba(0, 0, 0, 0.1);
`;

const ChatMessageInput = styled.input`
  width: 80%;
  height: 30px;
  margin: 30px 10px;
  border-radius: 5px;
  border: 1px solid gray;
  flex: 1;
`;

const ChatSubmitButton = styled.button`
  height: 35px;
  width: 70px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  :hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const RightContainer = styled.div`
  flex: 3;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  height: 95%;
  padding: 10px;
  margin: 0 80px 0 0;
`;

const UserList = styled.div`
  flex: 6.5;
  margin: 20px 20px 40px 20px;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.15);
  border: 2.5px solid white;
  border-radius: 20px;
`;

const User = styled.div`
  margin: 20px 0;
  display: flex;
  padding: 10px 30px;
  font-size: 1.5em;
  align-items: center;
  background-color: rgb(70, 70, 70);
  border-radius: 30px;
  color: white;
`;

const ProfilePicture = styled.img`
  height: 30px;
  width: 30px;
  border-radius: 50%;
  object-fit: cover;
`;

const ProfileText = styled.div`
  margin: 0 20px;
`;

const RightBottom = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-around;
`;

const ActionButton = styled.button`
  width: 10vw;
  height: 7.5vh;
  background-color: transparent;
  border-radius: 10px;
  border: 3px solid rgba(0, 0, 0, 0.5);
  font-size: 2em;
  color: gray;

  :hover {
    color: skyBlue;
    border: 3px solid skyBlue;
  }
`;

const MobileBackground = styled.div`
  display: none;
  position: relative;
  width: 100%;
  height: 100vh;
  background-image: linear-gradient(to bottom, rgb(4, 11, 23), rgb(51, 15, 46));

  @media screen and (max-width: 1023px) {
    display: block;
  }
`;

const MobileMessage = styled.div`
  display: none;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80%;
  text-align: center;
  transform: translate(-50%, -50%);
  font-size: 16px;
  z-index: 10;
  color: black;

  @media screen and (max-width: 1023px) {
    display: block;
  }
`;
