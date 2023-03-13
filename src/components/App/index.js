import React from "react";
import { Routes, Route } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import Login from "../Login";
import Lobby from "../Lobby";
import RoomMaker from "../RoomMaker";
import BattleRoom from "../BattleRoom";
import BattleResults from "../BattleResults";

export default function App() {
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Lobby />} />
        <Route path="/battles/new" element={<RoomMaker />} />
        <Route path="/battles/:roomId" element={<BattleRoom />} />
        <Route path="/battles/results" element={<BattleResults />} />
      </Routes>
    </>
  );
}

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
  }
`;
