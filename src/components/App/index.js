import React from "react";
import { Routes, Route } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../features/api/firebaseApi";

import Login from "../Login";
import Lobby from "../Lobby";
import Loading from "../Loading";
import RoomMaker from "../RoomMaker";
import BattleRoom from "../BattleRoom";
import BattleResults from "../BattleResults";

export default function App() {
  const [, loading] = useAuthState(auth);

  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={loading ? <Loading /> : <Lobby />} />
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
