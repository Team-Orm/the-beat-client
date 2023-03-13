import React from "react";
import styled from "styled-components";

export default function RoomMaker() {
  return (
    <RoomMakerContainer>
      <SongTitleBox>
        <ProfileImage src="/login.png" />
        <SongTitleText>테스트 1입니다.</SongTitleText>
        <CheckBox>✅</CheckBox>
      </SongTitleBox>
      <SongTitleBox>
        <ProfileImage src="/login.png" />
        <SongTitleText>테스트 2입니다.</SongTitleText>
        <CheckBox>✅</CheckBox>
      </SongTitleBox>
      <SongTitleBox>
        <ProfileImage src="/login.png" />
        <SongTitleText>테스트 3입니다.</SongTitleText>
        <CheckBox>✅</CheckBox>
      </SongTitleBox>
      <ButtonContainer>
        <CircularButton type="button">나가기</CircularButton>
        <CircularButton type="button">만들기</CircularButton>
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
  background-image: url("/room.png");
  background-size: cover;
  background-position: center;
`;

const SongTitleBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100px;
  width: 800px;
  border-radius: 50px;
  font-size: 5em;
  color: white;
  background-image: linear-gradient(to right, #000728, #00528f);

  :hover {
    background-image: linear-gradient(to right, #ffffff, #00528f);
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
  border: 3px solid black;
  font-size: 2em;
  color: black;

  :hover {
    color: white;
    border: 3px solid black;
    background-color: black;
  }
`;

const CheckBox = styled.div`
  margin-right: 30px;
  font-size: 0.5em;
`;
