import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../../features/api/firebaseApi";

export default function RoomMaker() {
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [hoveredSong, setHoveredSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const audioRef = useRef(null);

  const handleSelecet = (roomId) => {
    setSelectedSong((prev) => (prev === roomId ? null : roomId));
  };

  const playButton = (
    <PlayButton
      hovered={hoveredSong !== null}
      onClick={() => setIsPlaying(!isPlaying)}
    >
      {isPlaying ? "⏸️ BGM OFF" : "🎵 BGM ON"}
    </PlayButton>
  );

  const handleCreateRoom = async () => {
    try {
      const selected = songs.find((song) => song._id === selectedSong);

      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/rooms/new`,
        {
          song: selected,
          createdBy: auth.currentUser.displayName,
          uid: auth.currentUser.uid,
        },
      );

      if (response.status === 201) {
        return navigate(`/battles/${response.data.room._id}`);
      }

      throw new Error(response);
    } catch (err) {
      return navigate("/error", {
        state: {
          status: err.response.status,
          text: err.response.statusText,
          message: err.response.data.message,
        },
      });
    }
  };

  useEffect(() => {
    const getRoomsData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/rooms/new`,
        );

        if (response.status === 200) {
          return setSongs(response.data.songs);
        }

        throw new Error(response);
      } catch (err) {
        return navigate("/error", {
          state: {
            status: err.response.status,
            text: err.response.statusText,
            message: err.response.data.message,
          },
        });
      }
    };

    getRoomsData();
  }, [navigate, setSongs]);

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
      style={{
        backgroundImage: `url(${hoveredSong?.imageURL || "none"})`,
      }}
    >
      <AudioContainer ref={audioRef} />
      {playButton}
      {songs.map((song) => (
        <SongContainer
          key={song._id}
          onMouseEnter={() => setHoveredSong(song)}
          onMouseLeave={() => setHoveredSong(null)}
          onClick={() => handleSelecet(song._id)}
        >
          <ProfileImage src={song.imageURL} />
          <SongTitleText>
            {song.title} - {song.artist}
          </SongTitleText>
          <CheckBox>{selectedSong === song._id ? "✅" : null}</CheckBox>
        </SongContainer>
      ))}
      <ButtonContainer>
        <ActionButton type="button" hovered={hoveredSong !== null}>
          나가기
        </ActionButton>
        <ActionButton
          type="button"
          onClick={handleCreateRoom}
          hovered={hoveredSong !== null}
        >
          만들기
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

const SongContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 10%;
  width: 60%;
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

const ActionButton = styled.button`
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
