import axios from "axios";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../../features/api/firebaseApi";

export default function RoomMaker() {
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredSong, setHoveredSong] = useState(null);
  const [selectedSong, setSelectedSong] = useState(null);
  const audioRef = useRef(null);

  const handleSelect = useCallback((roomId) => {
    setSelectedSong((prev) => (prev === roomId ? null : roomId));
  }, []);

  const handleCreateRoom = async (mode) => {
    try {
      const selected = songs.find((song) => song._id === selectedSong);
      const jwt = localStorage.getItem("jwt");
      const user = JSON.parse(localStorage.getItem("user"));

      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/rooms/new`,
        {
          song: selected,
          createdBy: user ? user.name : auth.currentUser.displayName,
          uid: user ? user.uid : auth.currentUser.uid,
          mode,
        },
        {
          headers: {
            authorization: `Bearer ${jwt}`,
          },
        },
      );

      if (response.status === 201) {
        if (mode === "single") {
          return navigate(`/battles/single/${response.data.room._id}`);
        }

        return navigate(`/battles/${response.data.room._id}`);
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

  const renderSong = useCallback(
    (song, index) => (
      <SongContainer
        key={song._id}
        data-testid={song._id}
        onMouseEnter={() => setHoveredSong(song)}
        onMouseLeave={() => setHoveredSong(null)}
        onClick={() => handleSelect(song._id)}
        index={index}
      >
        <ProfileImage src={song.imageURL} />
        <SongTitleText>
          {song.title} - {song.artist}
        </SongTitleText>
        <CheckBox>{selectedSong === song._id ? "✅" : null}</CheckBox>
      </SongContainer>
    ),
    [handleSelect, selectedSong],
  );

  useEffect(() => {
    const getRoomsData = async () => {
      try {
        const jwt = localStorage.getItem("jwt");

        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/rooms/new`,
          {
            headers: {
              authorization: `Bearer ${jwt}`,
            },
          },
        );

        if (response.status === 200) {
          return setSongs(response.data.songs);
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

    getRoomsData();
  }, [navigate]);

  useEffect(() => {
    if (audioRef.current) {
      if (hoveredSong && isPlaying) {
        audioRef.current.src = hoveredSong.audioURL;
        audioRef.current.play();
      } else {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [hoveredSong, isPlaying]);

  return (
    <RoomMakerContainer
      data-pt="room-maker-container"
      data-testid="room-maker-container"
      style={{
        backgroundImage: `url(${hoveredSong?.imageURL || "none"})`,
      }}
    >
      <AudioContainer ref={audioRef} />
      <PlayButton
        hovered={hoveredSong !== null}
        onClick={() => setIsPlaying(!isPlaying)}
      >
        {isPlaying ? "⏸️ BGM OFF" : "🎵 BGM ON"}
      </PlayButton>
      {songs?.map(renderSong)}
      <ButtonContainer>
        <ActionButton
          type="button"
          hovered={hoveredSong !== null}
          action="leave"
          onClick={() => navigate("/")}
        >
          나가기
        </ActionButton>
        <ActionButton
          type="button"
          onClick={() => handleCreateRoom("battle")}
          hovered={hoveredSong !== null}
        >
          만들기
        </ActionButton>
        <ActionButton
          type="button"
          onClick={() => handleCreateRoom("single")}
          hovered={hoveredSong !== null}
        >
          싱글플레이
        </ActionButton>
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
  background: white;
  background-size: cover;
  background-position: center;
`;

const AudioContainer = styled.audio`
  display: none;
`;

const SongContainer = styled.div.attrs((props) => ({
  "data-pt": `song-container-${props.index}`,
}))`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 10%;
  width: 60%;
  border-radius: 50px;
  font-size: 5em;
  color: white;
  background-image: linear-gradient(to right, #000728, #00528f);
  transition: all 0.3s ease;
  cursor: pointer;

  :hover {
    border: 3px solid white;
    transform: scale(1.1);
    background-image: linear-gradient(to right, #ffffff, #00528f);
  }
`;

const PlayButton = styled.button.attrs({
  "data-pt": "play-button",
})`
  font-size: 2em;
  padding: 10px 20px;
  background-color: transparent;
  border: ${(props) => (props.hovered ? "2px solid white" : "2px solid black")};
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
  justify-content: space-around;
  flex-direction: row;
  width: 50%;
`;

const ActionButton = styled.button.attrs((props) => ({
  "data-pt": props.action === "leave" ? "leave-button" : "create-button",
}))`
  width: 200px;
  height: 75px;
  background-color: transparent;
  border-radius: 10px;
  font-size: 2em;
  border: ${(props) => (props.hovered ? "2px solid white" : "2px solid black")};
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
