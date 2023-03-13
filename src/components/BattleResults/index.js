import React from "react";
import styled from "styled-components";

export default function BattleResults() {
  return (
    <BattleResultsContainer>
      <PageTitle>Results</PageTitle>
      <ResultsWrapper>
        <ResultPanel>
          <Title>Winner</Title>
          <UserContainer>
            <UserImage src="/login.png" />
            <ResultsTitle>영빈님</ResultsTitle>
          </UserContainer>
          <TitleContainer>
            <ResultsTitle>perfect:</ResultsTitle>
            <ScoreTitle>100</ScoreTitle>
          </TitleContainer>
          <TitleContainer>
            <ResultsTitle>good:</ResultsTitle>
            <ScoreTitle>100</ScoreTitle>
          </TitleContainer>
          <TitleContainer>
            <ResultsTitle>bad:</ResultsTitle>
            <ScoreTitle>100</ScoreTitle>
          </TitleContainer>
          <TitleContainer>
            <ResultsTitle>miss:</ResultsTitle>
            <ScoreTitle>100</ScoreTitle>
          </TitleContainer>
          <StyledHr />
          <TitleContainer>
            <ResultsTitle>Total: </ResultsTitle>
            <ScoreTitle>101230</ScoreTitle>
          </TitleContainer>
        </ResultPanel>
        <ResultPanel>
          <Title>Loser</Title>
          <UserContainer>
            <UserImage src="/login.png" />
            <ResultsTitle>수빈님</ResultsTitle>
          </UserContainer>
          <TitleContainer>
            <ResultsTitle>perfect:</ResultsTitle>
            <ScoreTitle>100</ScoreTitle>
          </TitleContainer>
          <TitleContainer>
            <ResultsTitle>good:</ResultsTitle>
            <ScoreTitle>100</ScoreTitle>
          </TitleContainer>
          <TitleContainer>
            <ResultsTitle>bad:</ResultsTitle>
            <ScoreTitle>100</ScoreTitle>
          </TitleContainer>
          <TitleContainer>
            <ResultsTitle>miss:</ResultsTitle>
            <ScoreTitle>100</ScoreTitle>
          </TitleContainer>
          <StyledHr />
          <TitleContainer>
            <ResultsTitle>Total: </ResultsTitle>
            <ScoreTitle>101230</ScoreTitle>
          </TitleContainer>
        </ResultPanel>
      </ResultsWrapper>
      <ButtonContainer>
        <CircularButton type="button">나가기</CircularButton>
        <CircularButton type="button">기록하기</CircularButton>
      </ButtonContainer>
    </BattleResultsContainer>
  );
}

const BattleResultsContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-image: url("/battleresult777.png");
  background-size: cover;
  background-position: center;
`;

const Title = styled.h1`
  margin: auto;
  font-size: 5em;
`;

const ResultsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ResultPanel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 500px;
  height: 600px;
  margin: 0 20px;
  border: 5px solid black;
  border-radius: 10px;
  background-color: transparent;
`;

const UserImage = styled.img`
  width: 70px;
  height: 70px;
  border-radius: 50%;
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 75%;
  flex-direction: row;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 75%;
  flex-direction: row;
`;

const CircularButton = styled.button`
  width: 200px;
  height: 75px;
  margin-left: 25px;
  margin-right: 25px;
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

const ResultsTitle = styled.h1`
  margin-left: 10px;
  font-size: 2em;
  color: black;
`;

const ScoreTitle = styled.h1`
  margin-left: 30px;
  font-size: 2em;
  color: black;
`;

const UserContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
`;

const PageTitle = styled.h1`
  font-size: 5em;
  margin-top: 5px;
  margin-bottom: 0px;
  color: black;
`;

const StyledHr = styled.hr`
  border: 3px solid black;
  width: 400px;
`;
