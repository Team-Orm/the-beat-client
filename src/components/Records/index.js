import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

export default function Records() {
  const navigate = useNavigate();
  const [record, setRecord] = useState({});
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState("");

  const filteredRecord = Object.values(record).filter(
    (result) => result.title === selectedSong,
  );

  const sortedData = [...filteredRecord].sort(
    (a, b) => b.totalScore - a.totalScore,
  );

  useEffect(() => {
    const getRecordsData = async () => {
      try {
        const jwt = localStorage.getItem("jwt");

        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/records/`,
          {
            headers: {
              authorization: `Bearer ${jwt}`,
            },
          },
        );

        if (response.status === 200) {
          console.log(response);
          return setRecord(response.data.record);
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

    getRecordsData();
  }, [navigate]);

  useEffect(() => {
    const getSongs = async () => {
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

    getSongs();
  }, [navigate]);

  return (
    <Container>
      <HeaderContainer>
        <Title>노래목록:</Title>
        <TitleContainer>
          {songs?.map((song) => (
            <RecordsTitle
              key={song.title}
              onClick={() => setSelectedSong(song.title)}
              active={song.title === selectedSong}
            >
              {song.title}
            </RecordsTitle>
          ))}
        </TitleContainer>
      </HeaderContainer>
      <RecordsContainer>
        {!selectedSong
          ? "결과를 보고 싶은 노래를 선택해 주세요."
          : sortedData.map((record, index) => (
              <Record key={record._id}>
                <Ranking>{index + 1}</Ranking>
                <Name>{record.name}</Name>
                <Score>{record.totalScore}</Score>
                <Score>{record.title}</Score>
              </Record>
            ))}
      </RecordsContainer>
      <ActionButton onClick={() => navigate("/")}>나가기</ActionButton>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 0;
  width: 100vw;
  height: 100vh;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 5vh 0 0 0;
  width: 95vw;
  height: 10vh;
  font-size: 2vw;
  border-radius: 15px;

  box-shadow: inset -3px -3px 7px #d9d9d9,
    inset 3px 3px 7px rgba(255, 255, 255, 0.5);
`;

const Title = styled.div`
  display: flex;
  justify-content: center;
  width: 20vw;
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: calc(95vw - 20vw);
  overflow-x: scroll;
`;

const RecordsTitle = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px 20px;
  font-size: 2vw;
  border-radius: 20px;

  box-shadow: inset -3px -3px 7px #d9d9d9,
    inset 3px 3px 7px rgba(255, 255, 255, 0.5);

  :hover {
    color: rgba(255, 36, 0, 1);
  }
`;

const RecordsContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 5vh 0 0 0;
  padding: 5vh 0 5vh 0;
  width: 100%;
  height: 80vh;
  gap: 20px;
  z-index: 1;
  overflow-y: scroll;

  box-shadow: inset -3px -3px 7px #d9d9d9,
    inset 3px 3px 7px rgba(255, 255, 255, 0.5);
`;

const Record = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 95%;
  height: 10vh;
  border-radius: 15px;
  box-shadow: inset -3px -3px 7px #d9d9d9,
    inset 3px 3px 7px rgba(255, 255, 255, 0.5);
  z-index: 2;
`;

const Ranking = styled.div`
  display: flex;
  justify-content: center;
  font-size: 2vw;
`;

const Name = styled.div`
  display: flex;
  justify-content: center;
  font-size: 2vw;
`;

const Score = styled.div`
  display: flex;
  justify-content: center;
  font-size: 2vw;
`;

const ActionButton = styled.div`
  position: absolute;
  padding: 20px 30px;
  bottom: 7%;
  right: 5%;
  font-size: 2vw;
  border: 0.1px solid rgba(0, 0, 0, 0.05);
  border-radius: 30px;
  background-color: white;
  z-index: 3;
  box-shadow: 10px 10px 20px #d9d9d9, -10px -10px 20px #ffffff;

  :hover {
    color: rgba(255, 36, 0, 1);
    border: 2px solid rgba(255, 36, 0, 1);
  }
`;
