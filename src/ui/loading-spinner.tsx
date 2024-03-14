import React, { useEffect, useState } from "react";
import { Text } from "ink";

export function ProgressBar(): React.ReactNode {
  const frames = ["▱▱▱▱▱", "▰▱▱▱▱", "▰▰▱▱▱", "▰▰▰▱▱", "▰▰▰▰▱", "▰▰▰▰▰"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((currentIndex) => (currentIndex + 1) % frames.length);
    }, 200);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return <Text color={"cyan"}>{frames[index]}</Text>;
}

export function LoadingSpinner(): React.ReactNode {
  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((currentIndex) => (currentIndex + 1) % frames.length);
    }, 200);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return <Text color={"cyan"}>{frames[index]}</Text>;
}
