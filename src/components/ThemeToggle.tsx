
import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md">
      <Sun className="h-4 w-4 text-yellow-500" />
      <Switch
        checked={isDarkMode}
        onCheckedChange={toggleTheme}
      />
      <Moon className="h-4 w-4 text-blue-500" />
    </div>
  );
};

export default ThemeToggle;
