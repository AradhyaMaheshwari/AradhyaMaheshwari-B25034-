"use client";

import { IconMoon, IconSun } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [darkTheme, setDarkTheme] = useState(true);

  useEffect(() => {
    if (document.documentElement.getAttribute("data-theme") === "royalDark") {
      setDarkTheme(true);
    } else {
      setDarkTheme(false);
    }
  }, []);

  function toggleTheme() {
    if (
      document.documentElement.getAttribute("data-theme") === "royalDark" ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.setAttribute("data-theme", "royalLight");
      localStorage.theme = "light";
      setDarkTheme(false);
    } else {
      document.documentElement.setAttribute("data-theme", "royalDark");
      localStorage.theme = "dark";
      setDarkTheme(true);
    }
  }
  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className={"btn btn-ghost btn-circle swap swap-rotate hover:btn-primary transition-all duration-300 shadow-md" + (darkTheme ? " swap-active" : "")}
    >
      <IconSun className="swap-on m-auto block h-full text-accent" size={20} />
      <IconMoon className="swap-off m-auto block h-full text-primary" size={20} />
    </button>
  );
}
