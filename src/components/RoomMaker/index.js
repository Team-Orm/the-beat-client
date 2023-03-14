/* eslint-disable no-use-before-define */
/* eslint-disable no-underscore-dangle */
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

export default function RoomMaker() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [hoveredRoom, setHoveredRoom] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const audioRef = useRef(null);

  const handleClick = (roomId) => {
    setSelectedRoom((prevSelectedRoom) =>
      prevSelectedRoom === roomId ? null : roomId,
    );
  };

  const playButton = (
    <PlayButton
      hovered={hoveredRoom !== null}
      onClick={() => setIsPlaying(!isPlaying)}
    >
      {isPlaying ? "⏸️ BGM OFF" : "🎵 BGM ON"}
    </PlayButton>
  );

  useEffect(() => {
    async function getRoomsData() {
      try {
        const response = await axios.get("http://localhost:8000/api/rooms/new");

        if (response.data.result === "ok") {
          setRooms(response.data.songs);
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
    }

    getRoomsData();
  }, [setRooms]);

  useEffect(() => {
    if (audioRef.current) {
      if (hoveredRoom && isPlaying) {
        audioRef.current.src = hoveredRoom.audioURL;
        audioRef.current.play();
      } else {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [hoveredRoom, isPlaying]);

  return (
    <RoomMakerContainer
      style={{
        backgroundImage: `url(${hoveredRoom?.imageURL || null})`,
      }}
    >
      <AudioContainer ref={audioRef} />
      {playButton}
      {rooms.map((room) => (
        <SongContainer
          key={room._id}
          onMouseEnter={() => setHoveredRoom(room)}
          onMouseLeave={() => setHoveredRoom(null)}
          onClick={() => handleClick(room._id)}
        >
          <ProfileImage src={room.imageURL} />
          <SongTitleText>
            {room.title} - {room.artist}
          </SongTitleText>
          <CheckBox>{selectedRoom === room._id ? "✅" : null}</CheckBox>
        </SongContainer>
      ))}
      <ButtonContainer>
        <ButtonContainer>
          <CircularButton type="button" hovered={hoveredRoom !== null}>
            나가기
          </CircularButton>
          <CircularButton type="button" hovered={hoveredRoom !== null}>
            만들기
          </CircularButton>
        </ButtonContainer>
      </ButtonContainer>
    </RoomMakerContainer>
  );
}

const RoomMakerContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background: aliceblue;
  background-size: cover;
  background-position: center;
`;

const AudioContainer = styled.audio`
  display: hidden;
`;

const SongContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 100px;
  width: 800px;
  border-radius: 50px;
  font-size: 5em;
  color: white;
  background-image: linear-gradient(to right, #000728, #00528f);

  :hover {
    border: 3px solid white;
    background-image: linear-gradient(to right, #ffffff, #00528f);
  }
`;

const PlayButton = styled.button`
  position: absolute;
  bottom: 30px;
  font-size: 2em;
  background-color: transparent;
  border: ${(props) => (props.hovered ? "white" : "black")};
  color: ${(props) => (props.hovered ? "white" : "black")};
  border-radius: 5px;

  :hover {
    color: white;
    background-color: black;
  }
`;

const SongTitleText = styled.div`
  font-size: 0.5em;
  color: white;
  margin-left: 20px;
`;

const ProfileImage = styled.img`
  width: 80px;
  height: 80px;
  margin-left: 20px;
  border-radius: 50%;
  object-fit: cover;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const CircularButton = styled.button`
  width: 200px;
  height: 75px;
  margin-left: 50px;
  margin-right: 50px;
  background-color: transparent;
  border-radius: 10px;
  font-size: 2em;
  border: ${(props) => (props.hovered ? "white" : "black")};
  color: ${(props) => (props.hovered ? "white" : "black")};

  :hover {
    color: white;
    border: 3px solid black;
    background-color: black;
  }
`;

const CheckBox = styled.div`
  display: flex;
  justify-content: flex-end;
  flex: 4;
  margin-right: 30px;
  font-size: 0.5em;
`;
