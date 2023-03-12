/* eslint-disable prefer-template */
import React, { useEffect, useState } from "react";

export default function Loading({ text = "Loading", speed = 300 }) {
  const [content, setContent] = useState(text);

  useEffect(() => {
    const interval = setInterval(() => {
      // eslint-disable-next-line no-unused-expressions
      content === text + "..."
        ? setContent(text)
        : setContent((prevContent) => prevContent + ".");
    }, speed);

    return () => clearInterval(interval);
  }, [content, speed, text]);

  return <p>{content}</p>;
}
