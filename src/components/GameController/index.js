/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-shadow */
import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import {
  NOTES,
  MILLISECOND,
  SPEED,
  KEYS,
  DIFFICULTY,
} from "../../store/contants";

export default function GameController({ isPlaying }) {
  const [activeKey, setActiveKey] = useState("");
  const [word, setWord] = useState("");
  const [notes, setNotes] = useState(NOTES);
  const canvasRef = useRef(null);
  const notesRef = useRef(notes);
  const deltaRef = useRef(null);
  const timeRef = useRef(0);

  const canvas = canvasRef.current;
  const ctx = canvas?.getContext("2d");

  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);

  const calculateScore = (word) => {
    let score;

    switch (word) {
      case "excellent":
        score = 100;
        break;
      case "good":
        score = 80;
        break;
      case "off beat":
        score = 40;
        break;
      default:
        score = 0;
    }

    return score;
  };

  const columnWidth = canvas?.width / KEYS.length;
  const noteHeight = canvas?.width / (6 * 3 * 3);

  const keyMappings = {
    s: { positionX: columnWidth * 0, color: "red" },
    d: { positionX: columnWidth * 1, color: "blue" },
    f: { positionX: columnWidth * 2, color: "yellow" },
    j: { positionX: columnWidth * 3, color: "purple" },
    k: { positionX: columnWidth * 4, color: "orange" },
    l: { positionX: columnWidth * 5, color: "skyblue" },
  };

  const renderInteracts = (ctx, note) => {
    for (const key in keyMappings) {
      if (keyMappings.hasOwnProperty(key) && activeKey === key) {
        const gradient = ctx.createLinearGradient(
          key.positionX,
          window.innerHeight,
          key.positionX,
          0,
        );

        gradient.addColorStop(0, `red`);
        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;
        ctx.fillRect(
          keyMappings[key].positionX,
          0,
          columnWidth,
          window.innerHeight,
        );
      }
    }
  };

  const onPress = useCallback((key) => {
    const targetNote = notesRef.current.find((note) => note.key === key);
    const diffTimeNoteAndKey = Math.abs(
      targetNote.time + 2.14 - timeRef.current, // 2.14 === note.positionY > canvas.height;
    );

    const accuracyTime = (SPEED * 10) / DIFFICULTY; // 0.35
    const judge = diffTimeNoteAndKey < 0.35;

    if (!judge) {
      return;
    }

    if (diffTimeNoteAndKey <= accuracyTime / 2) {
      setWord("good");
    } else if (diffTimeNoteAndKey <= accuracyTime / 3) {
      setWord("excellent");
    } else {
      setWord("off beat");
    }

    setCombo((prev) => prev + 1);

    notesRef.current = notesRef.current.filter((note) => note !== targetNote);
    setNotes((prev) => prev.filter((note) => note !== targetNote));
  }, []);

  const activate = useCallback((event) => {
    const { key } = event;
    if (keyMappings[key]) {
      setActiveKey(key);
      onPress(key);
    }
  }, []);

  const deActivate = useCallback((event) => {
    const { key } = event;
    if (keyMappings[key]) {
      setActiveKey("");
    }
  }, []);

  const render = (ctx, note) => {
    const cornerRadius = 5;

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

    if (note.positionY > canvas.height) {
      return;
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
      const visibleNotes = notes.filter((note) => note.time <= timeRef.current);
      renderNotes(now, deltaRef.current, ctx, visibleNotes);
      // renderInteracts(ctx);
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
  }, [isPlaying, ctx, canvas]);

  useEffect(() => {
    notesRef.current = notes;
    setScore((prev) => prev + calculateScore(word));
  }, [notes]);

  useEffect(() => {
    window.addEventListener("keydown", activate);
    return () => {
      window.removeEventListener("keydown", activate);
    };
  }, [activate]);

  useEffect(() => {
    window.addEventListener("keyup", deActivate);
    return () => {
      window.removeEventListener("keyup", deActivate);
    };
  }, [deActivate]);

  return (
    <GameContainer>
      <CanvasContainer ref={canvasRef} />
      <TextContainer>
        <div>{word.toUpperCase()}</div>
        <div>{combo === 0 ? null : combo}</div>
        <div>{score === 0 ? null : score}</div>
      </TextContainer>
      <ColumnsContainer>
        {KEYS.map((key, index) => (
          <Column key={key} index={index} active={key === activeKey} />
        ))}
      </ColumnsContainer>
      <HitBox />
      <KeyBox>
        {KEYS.map((key) => (
          <Key key={key} active={key === activeKey}>
            {key.toUpperCase()}
          </Key>
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
  background-color: rgba(0, 0, 0, 0.85);
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

  ${({ active }) =>
    active &&
    `
    background: linear-gradient(
      rgba(217, 217, 217, 0) 0%,
      rgba(255, 74, 74, 0.75) 100%
    );
  `}
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

  ${({ active }) =>
    active &&
    `
    background: rgba(217, 217, 217, 0.25)
  `}
`;

const TextContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  position: absolute;
  width: 100%;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 3em;
  z-index: 1;
`;
