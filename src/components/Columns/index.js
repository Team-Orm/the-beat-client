import React, { useRef, useEffect, useCallback } from "react";
import { KEYS, COLUMN_RGB_COLORS } from "../../store/constants";

const getColor = (index) => {
  switch (index) {
    case 0:
    case 5:
      return COLUMN_RGB_COLORS[0];
    case 1:
    case 4:
      return COLUMN_RGB_COLORS[1];
    default:
      return COLUMN_RGB_COLORS[2];
  }
};

export default function Columns({ activeKeys }) {
  const canvasRef = useRef(null);
  const opacityRef = useRef(1);
  const opacityStep = 0.03;

  const resizeCanvas = (canvas) => {
    canvas.height = window.innerHeight * 0.9 * 0.875 - 5; // Adjust the multiplier and offset based on your desired height
  };

  const drawColumn = useCallback(
    (context, index, active) => {
      const columnWidth = context.canvas.width / 6;
      const columnHeight = context.canvas.height;
      const left = columnWidth * index + 2.5;
      const top = 5;

      if (activeKeys.length) {
        opacityRef.current = 1;
      }

      if (opacityRef.current !== 0) {
        opacityRef.current -= opacityStep;
      }

      if (active) {
        const gradient = context.createLinearGradient(
          0,
          top + columnHeight,
          0,
          top,
        );

        const color = getColor(index);
        gradient.addColorStop(0, `rgba(${color}, ${opacityRef.current})`);
        gradient.addColorStop(1, "transparent");

        context.fillStyle = gradient;
        context.fillRect(left, top, columnWidth, columnHeight);
      }

      if (index !== 5) {
        context.strokeStyle = "lightgray";
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(left + columnWidth, top);
        context.lineTo(left + columnWidth, top + columnHeight);
        context.stroke();
      }
    },
    [activeKeys],
  );

  const draw = useCallback(
    (context) => {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);

      KEYS.forEach((key, index) => {
        drawColumn(context, index, activeKeys.includes(key));
      });
    },
    [activeKeys, drawColumn],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    let animationFrameId;

    const handleResize = () => {
      resizeCanvas(canvas);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    const render = () => {
      draw(context);
      animationFrameId = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [draw]);

  return <canvas ref={canvasRef} />;
}
