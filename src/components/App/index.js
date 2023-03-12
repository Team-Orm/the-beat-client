import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../Login";
import Lobby from "../Lobby";
import RoomMaker from "../RoomMaker";
import BattleRoom from "../BattleRoom";
import BattleResults from "../BattleResults";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Lobby />} />
      <Route path="/battles/new" element={<RoomMaker />} />
      <Route path="/battles/:battleId" element={<BattleRoom />} />
      <Route path="/battles/results" element={<BattleResults />} />
    </Routes>
  );
}
