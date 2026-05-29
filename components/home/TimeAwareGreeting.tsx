"use client";

import { useState, useEffect } from "react";

export function TimeAwareGreeting() {
  const [greeting, setGreeting] = useState("Hello.");

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 11) {
      setGreeting("Good morning.");
    } else if (hours >= 11 && hours < 17) {
      setGreeting("Good afternoon.");
    } else if (hours >= 17 && hours < 22) {
      setGreeting("Good evening.");
    } else {
      setGreeting("You're up late.");
    }
  }, []);

  return <span>{greeting}</span>;
}
