/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-shadow */
/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import { NOTES, MILLISECOND, SPEED, KEYS } from "../../store/contants";

export default function GameController({ isPlaying }) {
  const [activeKey, setActiveKey] = useState("");
  const timeRef = useRef(0);
  const deltaRef = useRef(null);
  const canvasRef = useRef(null);
  const canvas = canvasRef.current;
  const ctx = canvas?.getContext("2d");

  const noteHeight = canvas?.width / (6 * 3 * 3);

  const render = (ctx, note) => {
    const columnWidth = canvas.width / KEYS.length;
    const cornerRadius = 5;

    const keyMappings = {
      s: { positionX: columnWidth * 0, color: "red" },
      d: { positionX: columnWidth * 1, color: "blue" },
      f: { positionX: columnWidth * 2, color: "yellow" },
      j: { positionX: columnWidth * 3, color: "purple" },
      k: { positionX: columnWidth * 4, color: "orange" },
      l: { positionX: columnWidth * 5, color: "skyblue" },
    };

    const mapping = keyMappings[note?.key];
    if (mapping) {
      note.positionX = mapping.positionX;
      note.color = mapping.color;
    }

    ctx.fillStyle = `${note?.color}`;
    ctx.beginPath();
    ctx.moveTo(note.positionX + cornerRadius, note.positionY);
    ctx.lineTo(note.positionX + columnWidth - cornerRadius, note.positionY);
    ctx.quadraticCurveTo(
      note.positionX + columnWidth,
      note.positionY,
      note.positionX + columnWidth,
      note.positionY + cornerRadius,
    );
    ctx.lineTo(
      note.positionX + columnWidth,
      note.positionY + noteHeight - cornerRadius,
    );
    ctx.quadraticCurveTo(
      note.positionX + columnWidth,
      note.positionY + noteHeight,
      note.positionX + columnWidth - cornerRadius,
      note.positionY + noteHeight,
    );
    ctx.lineTo(note.positionX + cornerRadius, note.positionY + noteHeight);
    ctx.quadraticCurveTo(
      note.positionX,
      note.positionY + noteHeight,
      note.positionX,
      note.positionY + noteHeight - cornerRadius,
    );
    ctx.lineTo(note.positionX, note.positionY + cornerRadius);
    ctx.quadraticCurveTo(
      note.positionX,
      note.positionY,
      note.positionX + cornerRadius,
      note.positionY,
    );
    ctx.closePath();
    ctx.fill();
  };

  const update = (now, delta, ctx, note) => {
    const diffTimeBetweenAnimationFrame = (now - delta) / MILLISECOND;
    if (note) {
      note.positionY += diffTimeBetweenAnimationFrame * SPEED;
    }

    render(ctx, note);
  };

  const renderNotes = (now, delta, ctx, notes) => {
    const notesArray = notes.sort((prev, next) => prev.time - next.time);

    notesArray.forEach((note) => {
      update(now, delta, ctx, note);
    });
  };

  useEffect(() => {
    let animationFrameId;

    const updateNotes = () => {
      const now = Date.now();

      if (!deltaRef.current) {
        deltaRef.current = now;
      }

      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      timeRef.current += (now - deltaRef.current) / MILLISECOND;
      const visibleNotes = NOTES.filter((note) => note.time <= timeRef.current);
      renderNotes(now, deltaRef.current, ctx, visibleNotes);
      animationFrameId = requestAnimationFrame(updateNotes);

      deltaRef.current = now;
    };

    if (isPlaying) {
      updateNotes();
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isPlaying]);

  return (
    <GameContainer>
      <CanvasContainer ref={canvasRef} />
      <ColumnsContainer>
        {KEYS.map((key, index) => (
          <Column key={index} index={index} />
        ))}
      </ColumnsContainer>
      <HitBox />
      <KeyBox>
        {KEYS.map((key, index) => (
          <React.Fragment key={index}>
            <Key>{key.toUpperCase()}</Key>
          </React.Fragment>
        ))}
      </KeyBox>
    </GameContainer>
  );
}

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  height: 100%;
`;

const CanvasContainer = styled.canvas`
  flex: 7;
  width: 100%;
  /* height: 80%; */
  background-color: black;
  box-shadow: inset 0 0 0 5px white;
`;

const ColumnsContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const Column = styled.div`
  position: absolute;
  top: 5px;
  left: ${({ index }) => `calc(100% / 6 * ${index})`};
  background-color: rgba(255, 255, 255, 0.2);
  width: ${({ index }) =>
    index === 5 ? `calc(100% / 6 - 5px)` : `calc(100% / 6)`};
  height: ${`calc(87.5% - 10px)`};
  border-right: ${({ index }) => (index === 5 ? null : "2px solid gray")};
`;

const HitBox = styled.div`
  position: absolute;
  bottom: 12.5%;
  background-color: rgba(255, 255, 255, 0.2);
  width: 100%;
  height: 3%;
`;

const KeyBox = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
`;

const Key = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2em;
  color: white;
  width: 100%;
  box-shadow: inset 0 0 0 5px white;
`;
