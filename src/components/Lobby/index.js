/* eslint-disable no-underscore-dangle */
import { io } from "socket.io-client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { auth } from "../../features/api/firebaseApi";

export default function Lobby() {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState();
  const [socket, setSocket] = useState();
  const [newUser, setNewUser] = useState({});
  const [currentUserList, setCurrentUserList] = useState();
  const [rooms, setRooms] = useState();

  useEffect(() => {
    if (auth && auth.currentUser) {
      const { accessToken, email, displayName, photoURL, uid } =
        auth.currentUser;
      setNewUser({
        accessToken,
        email,
        displayName,
        photoURL,
        uid,
      });
    }
  }, [auth, auth?.currentUser]);

  const { accessToken, email, displayName, photoURL, uid } = newUser;

  useEffect(() => {
    const socketClient = io("http://localhost:4000", {
      query: {
        userName: displayName,
        profile: photoURL,
        userKey: uid,
      },
    });
    setSocket(socketClient);

    return () => {
      socketClient.disconnect();
    };
  }, [displayName, photoURL]);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/users/logout",
      );

      if (response.status === 204) {
        localStorage.removeItem("jwt");
        auth.signOut();

        return navigate("/login");
      }

      return true;
    } catch (err) {
      return navigate("/error", {
        state: {
          status: err.response.status,
          text: err.response.statusText,
          message: err.message,
        },
      });
    }
  };

  const redirectToNewRoom = () => {
    try {
      navigate("/battles/new");

      return true;
    } catch (err) {
      return navigate("/error", {
        state: {
          status: err.response.status,
          text: err.response.statusText,
          message: err.message,
        },
      });
    }
  };

  useEffect(() => {
    const getJWTToken = async () => {
      const response = await axios.post(
        "http://localhost:8000/api/users/login",
        { accessToken, email, displayName, photoURL },
      );

      if (response.data.result === "ok") {
        localStorage.setItem("jwt", response.data.token);
      }

      return true;
    };

    getJWTToken();
  }, [accessToken, email, displayName, photoURL]);

  useEffect(() => {
    async function getPhotos() {
      const proxyUrl = "https://api.allorigins.win/raw?url=";
      const photo = await fetch(proxyUrl + photoURL);
      const blob = await photo.blob();
      const urls = URL.createObjectURL(blob);

      setPhotos(urls);
    }

    getPhotos();
  }, [photoURL]);

  useEffect(() => {
    if (socket) {
      socket.emit("send-chat", {
        user: auth.currentUser,
        chat: "테스트 채팅!",
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("broadcast-chat", (user, chat) => {});
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("update-user", (currentUser) => {
        setCurrentUserList(currentUser);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("update-rooms", (updatedRooms) => {
        setRooms((pre) => updatedRooms);
      });
    }
  }, [socket, currentUserList]);

  return (
    <Background>
      <HeaderContainer>
        <LeftHeader>Room</LeftHeader>
        <RightHeader>User</RightHeader>
      </HeaderContainer>
      <Container>
        <LeftContainer>
          <Rooms>
            <RoomsLists>
              {rooms &&
                rooms.map((roomData) => (
                  <Room key={roomData._id}>
                    <RoomName>{roomData.createdBy}</RoomName>
                    <RoomSong>{roomData.song}</RoomSong>
                  </Room>
                ))}
            </RoomsLists>
          </Rooms>
          <Chats>
            <ChatsHead>Chats</ChatsHead>
            <ChatList>
              <ChatContainer>{displayName}: message</ChatContainer>
              <ChatContainer>{displayName}: message</ChatContainer>
            </ChatList>
          </Chats>
          <ChatBoxBottom>
            <ChatMessageInput type="text" />
            <ChatSubmitButton>Send</ChatSubmitButton>
          </ChatBoxBottom>
        </LeftContainer>
        <RightContainer>
          <UserLists>
            {currentUserList &&
              currentUserList.map((userData) => (
                <User key={userData.userKey}>
                  <ProfilePicture src={userData.profile}></ProfilePicture>
                  <ProfileText>{userData.userName}</ProfileText>
                </User>
              ))}
          </UserLists>
          <RightBottom>
            <LogoutButton type="button" onClick={redirectToNewRoom}>
              방 만들기
            </LogoutButton>
            <LogoutButton type="button" onClick={handleLogout}>
              Logout
            </LogoutButton>
          </RightBottom>
        </RightContainer>
      </Container>
    </Background>
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

const Rooms = styled.div`
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

const Chats = styled.div`
  flex: 4;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  color: gray;
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
  background-color: rgba(0, 0, 0, 0.15);
  border: 2.5px solid white;
  border-radius: 20px;
`;

const ChatContainer = styled.div`
  margin: 0 15px;
  display: flex;
  width: 80%;
  height: 20%;
  align-items: center;
  color: black;
`;

const ChatBoxBottom = styled.form`
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

const UserLists = styled.div`
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

const LogoutButton = styled.button`
  width: 200px;
  height: 75px;
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
