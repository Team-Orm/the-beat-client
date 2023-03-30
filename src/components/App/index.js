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
import NotFound from "../Error/NotFound";
import Error from "../Error";
import Records from "../Records";

export default function App() {
  const [, loading] = useAuthState(auth);

  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route path="/login" element={loading ? <Loading /> : <Login />} />
        <Route path="/" element={<Lobby />} />
        <Route path="/records" element={<Records />} />
        <Route path="/battles">
          <Route path="new" element={<RoomMaker />} />
          <Route
            path="single/:roomId"
            element={loading ? <Loading /> : <BattleRoom />}
          />
          <Route
            path=":roomId"
            element={loading ? <Loading /> : <BattleRoom />}
          />
          <Route path="results/:resultId" element={<BattleResults />} />
        </Route>
        <Route path="/error" element={<Error />} />
        <Route path="*" element={<NotFound />} />
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
