import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import styled, { css, keyframes } from "styled-components";
import {
  updateScore,
  endSong,
  updateCombo,
  updateWord,
} from "../../features/reducers/gameSlice";
import { calculateScore, getColor } from "../../features/utils";
import { MILLISECOND, SPEED, KEYS, DIFFICULTY } from "../../store/constants";

export default function GameController({
  isPlaying,
  isCurrentUser,
  sendKeyPressToOpponents,
  sendKeyReleaseToOpponents,
  battleUserKeys,
  battleUserResults,
  initialNotes,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { roomId } = useParams();
  const maxNotesNumber = [...initialNotes].length - 1;

  const [word, setWord] = useState("");
  const [notes, setNotes] = useState(initialNotes);
  const [activeKeys, setActiveKeys] = useState([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [animateCombo, setAnimateCombo] = useState(false);

  const timeRef = useRef(0);
  const comboRef = useRef(0);
  const deltaRef = useRef(null);
  const notesRef = useRef(notes);
  const canvasRef = useRef(null);
  const songEndRef = useRef(false);

  const canvas = canvasRef?.current;
  const ctx = canvas?.getContext("2d");
  const columnHeight = canvas?.height * 0.9;
  const columnWidth = canvas?.width / KEYS.length;
  const noteHeight = canvas?.width / (KEYS.length * 3 * 3);
  const borderWidth = 5;

  const songDuration = Math.max(...notes.map((note) => note.time));

  const comboResults = useMemo(() => {
    return {
      excellent: 0,
      good: 0,
      miss: 0,
    };
  }, []);

  const keyMappings = useMemo(() => {
    return {
      s: { positionX: columnWidth * 0, color: "rgba(255, 36, 0, 1)" },
      d: { positionX: columnWidth * 1, color: "rgba(125, 249, 255, 1)" },
      f: { positionX: columnWidth * 2, color: "rgba(255, 211, 0, 1)" },
      j: { positionX: columnWidth * 3, color: "rgba(255, 211, 0, 1)" },
      k: { positionX: columnWidth * 4, color: "rgba(125, 249, 255, 1)" },
      l: { positionX: columnWidth * 5, color: "rgba(255, 36, 0, 1)" },
    };
  }, [columnWidth]);

  const onPressKey = useCallback(
    (key) => {
      const hitBoxPositionPercentage = 0.125;
      const positionOfHitBox =
        columnHeight * (1 - hitBoxPositionPercentage) - borderWidth * 2;
      const averageFrame = MILLISECOND / 60;
      const pixerPerFrame = (SPEED / 10) * averageFrame;
      const distanceToHitBoxMiddle = positionOfHitBox - noteHeight;
      const timeToHitBoxMiddle = distanceToHitBoxMiddle / pixerPerFrame; // time = distance / speed;

      const notesCloseToHitBox = notesRef.current.filter(
        (note) =>
          note.key === key && note.positionY >= positionOfHitBox - noteHeight,
      );

      // If there are no notes close to the hitbox, do nothing
      if (notesCloseToHitBox.length === 0) {
        return;
      }

      // Find the note with the minimum timeFromNoteToHitBox
      const targetNote = notesCloseToHitBox.reduce((minNote, currentNote) => {
        const minTimeFromNoteToHitBox = Math.abs(
          minNote?.time + timeToHitBoxMiddle - timeRef.current,
        );

        const currentTimeFromNoteToHitBox = Math.abs(
          currentNote?.time + timeToHitBoxMiddle - timeRef.current,
        );

        return currentTimeFromNoteToHitBox < minTimeFromNoteToHitBox
          ? currentNote
          : minNote;
      });

      const timeFromNoteToHitBox = Math.abs(
        targetNote?.time + timeToHitBoxMiddle - timeRef.current,
      );

      const maximumTiming = SPEED / DIFFICULTY; // 0.3
      const withinTimingThreshold = timeFromNoteToHitBox < maximumTiming;

      if (!withinTimingThreshold) {
        return;
      }

      let currentWord;
      if (timeFromNoteToHitBox <= maximumTiming / 5) {
        currentWord = "excellent";
      } else if (timeFromNoteToHitBox <= maximumTiming / 3) {
        currentWord = "good";
      } else {
        currentWord = "miss";
      }

      dispatch(updateWord(currentWord));
      setWord(currentWord);

      if (currentWord === "miss") {
        comboRef.current = 0;
        dispatch(updateCombo(comboRef.current));
      } else {
        setAnimateCombo(true);
        comboRef.current += 1;
        dispatch(updateCombo(comboRef.current));

        setCurrentScore((prevScore) => {
          const incomingScore = calculateScore(currentWord);
          const comboBonus = comboRef.current * incomingScore * 0.5;
          const result = prevScore + incomingScore + comboBonus;

          return result;
        });
      }

      comboResults[currentWord] += 1;

      notesRef.current = notesRef.current.filter((note) => note !== targetNote);
      setNotes((prev) => prev.filter((note) => note !== targetNote));
    },
    [columnHeight, comboResults, dispatch, noteHeight],
  );

  const activateKeys = useCallback(
    (event) => {
      if (!isCurrentUser) return;

      const { key } = event;
      if (keyMappings[key]) {
        setActiveKeys((prevActiveKeys) => [...prevActiveKeys, key]);
        onPressKey(key);
        sendKeyPressToOpponents(key);
      }
    },
    [sendKeyPressToOpponents, isCurrentUser, keyMappings, onPressKey],
  );

  const deActivateKeys = useCallback(
    (event) => {
      if (!isCurrentUser) return;

      const { key } = event;
      if (keyMappings[key]) {
        setActiveKeys((prevActiveKeys) => {
          return prevActiveKeys.filter((activeKey) => activeKey !== key);
        });
        sendKeyReleaseToOpponents(key);
      }
    },
    [sendKeyReleaseToOpponents, isCurrentUser, keyMappings],
  );

  const renderRoundNotes = useCallback(
    (ctx, { positionX, positionY, key, color }) => {
      const cornerRadius = 5;

      const mapping = keyMappings[key];
      if (mapping) {
        positionX = mapping.positionX;
        color = mapping.color;
      }

      ctx.fillStyle = `${color}`;
      ctx.beginPath();
      ctx.moveTo(positionX + cornerRadius, positionY);
      ctx.lineTo(positionX + columnWidth - cornerRadius, positionY);
      ctx.quadraticCurveTo(
        positionX + columnWidth,
        positionY,
        positionX + columnWidth,
        positionY + cornerRadius,
      );
      ctx.lineTo(
        positionX + columnWidth,
        positionY + noteHeight - cornerRadius,
      );
      ctx.quadraticCurveTo(
        positionX + columnWidth,
        positionY + noteHeight,
        positionX + columnWidth - cornerRadius,
        positionY + noteHeight,
      );
      ctx.lineTo(positionX + cornerRadius, positionY + noteHeight);
      ctx.quadraticCurveTo(
        positionX,
        positionY + noteHeight,
        positionX,
        positionY + noteHeight - cornerRadius,
      );
      ctx.lineTo(positionX, positionY + cornerRadius);
      ctx.quadraticCurveTo(
        positionX,
        positionY,
        positionX + cornerRadius,
        positionY,
      );
      ctx.closePath();
      ctx.fill();
    },
    [columnWidth, keyMappings, noteHeight],
  );

  const update = useCallback(
    (now, delta, ctx, note) => {
      const diffTimeBetweenAnimationFrame = (now - delta) / MILLISECOND;

      if (note) {
        note.positionY += diffTimeBetweenAnimationFrame * SPEED;
      }

      if (note.positionY >= canvas?.height) {
        if (note.time < timeRef.current - SPEED / DIFFICULTY) {
          comboRef.current = 0;
          comboResults.miss += 1;
          notesRef.current = notesRef.current.filter((n) => n !== note);
          setNotes((prev) => prev.filter((n) => n !== note));
          setWord(() => "miss");
        }
      } else {
        return renderRoundNotes(ctx, note);
      }
    },
    [canvas?.height, comboResults, renderRoundNotes],
  );

  const renderNotes = useCallback(
    (now, delta, ctx, notes) => {
      const notesArray = notes.sort((prev, next) => prev.time - next.time);

      notesArray.forEach((note) => {
        update(now, delta, ctx, note);
      });
    },
    [update],
  );

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

      if (timeRef.current >= songDuration + 3) {
        if (
          !songEndRef.current &&
          comboResults.excellent > 0 &&
          comboResults.good > 0
        ) {
          songEndRef.current = true;
          dispatch(endSong({ comboResults, currentScore, maxNotesNumber }));
          return navigate(`/battles/results/${roomId}`);
        }
      } else {
        animationFrameId = requestAnimationFrame(updateNotes);
      }

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
  }, [
    ctx,
    canvas,
    notes,
    isPlaying,
    songDuration,
    roomId,
    comboResults,
    currentScore,
    maxNotesNumber,
    renderNotes,
  ]);

  useEffect(() => {
    dispatch(updateScore(currentScore));
  }, [currentScore, dispatch]);

  useEffect(() => {
    notesRef.current = notes;
    setCurrentScore((prev) => prev + calculateScore(word));
  }, [notes, word]);

  useEffect(() => {
    window.addEventListener("keydown", activateKeys);
    return () => {
      window.removeEventListener("keydown", activateKeys);
    };
  }, [activateKeys]);

  useEffect(() => {
    window.addEventListener("keyup", deActivateKeys);
    return () => {
      window.removeEventListener("keyup", deActivateKeys);
    };
  }, [deActivateKeys]);

  useEffect(() => {
    if (initialNotes.length) {
      setNotes(initialNotes);
    }
  }, [initialNotes]);

  useEffect(() => {
    if (animateCombo) {
      const timer = setTimeout(() => {
        setAnimateCombo(false);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [animateCombo]);

  return (
    <GameContainer>
      <CanvasContainer
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        data-testid="canvas-container"
      />
      <TextContainer data-testid="text-container">
        {isCurrentUser ? (
          <div>{word !== "" && word.toUpperCase()}</div>
        ) : (
          battleUserResults?.word?.toUpperCase()
        )}
        <ComboText animate={animateCombo}>
          {battleUserResults?.combo ? (
            <div data-pt="battle-user-combo">{battleUserResults?.combo}</div>
          ) : (
            <div data-pt="current-user-combo" data-testid="combo">
              {comboRef.current === 0 ? null : comboRef.current}
            </div>
          )}
        </ComboText>
        {battleUserResults?.score ? (
          battleUserResults?.score
        ) : (
          <div data-testid="currentScore">
            {currentScore === 0 ? null : currentScore}
          </div>
        )}
      </TextContainer>
      <ColumnsContainer data-testid="columns-container">
        {KEYS.map((key, index) => (
          <Column
            key={key}
            index={index}
            active={
              battleUserKeys
                ? battleUserKeys.includes(key)
                : activeKeys.includes(key)
            }
          />
        ))}
      </ColumnsContainer>
      <HitBox data-testid="hit-box" />
      <KeyBox>
        {KEYS.map((key, index) => (
          <Key
            key={key}
            data-pt={`key-container-${index}`}
            data-active={battleUserKeys?.length ? "true" : "false"}
            index={index}
            active={
              battleUserKeys
                ? battleUserKeys.includes(key)
                : activeKeys.includes(key)
            }
            data-testid={`key-container-${index}`}
          >
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
  background-color: rgba(0, 0, 0, 0.5);
  box-shadow: inset 0 0 0 5px white;
  width: 100%;
  height: 100%;
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

const growAndShrink = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(2);
  }
  100% {
    transform: scale(1);
  }
`;

const ComboText = styled.div`
  animation: ${({ animate }) =>
    animate
      ? css`
          ${growAndShrink} 0.25s
        `
      : "none"};
`;

const ColumnsContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;

export const Column = styled.div.attrs((props) => ({
  "data-testid": `column-container-${props.index}`,
}))`
  position: absolute;
  top: 5px;
  left: ${({ index }) => `calc(100% / 6 * ${index})`};
  background-color: transparent;
  width: ${({ index }) =>
    index === 5 ? `calc(100% / 6 - 5px)` : `calc(100% / 6)`};
  height: ${`calc(87.5% - 10px)`};
  border-right: ${({ index }) => (index === 5 ? null : "2px solid gray")};

  ${({ active, index }) => {
    const color = getColor(index);
    return (
      active &&
      `
      background: linear-gradient(to top, rgba(${color}, 0.8), rgba(${color}, 0));
    `
    );
  }}
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

export const Key = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2em;
  color: white;
  width: 100%;
  box-shadow: inset 0 0 0 5px white;
  transition: transform 0.1s ease;

  ${({ active, index }) => {
    const color = getColor(index);
    return (
      active &&
      `
      background: rgba(${color}, 1);
      transform: scale(1.25);
    `
    );
  }}
`;
