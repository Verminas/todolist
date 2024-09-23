import { useState } from "react";
import { createTheme } from "@mui/material/styles";

type ThemeMode = "dark" | "light";

export const useTheme = (mode: ThemeMode) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(mode);

  const changeTheme = () => {
    setThemeMode(themeMode === "light" ? "dark" : "light");
  };

  const theme = createTheme({
    palette: {
      mode: themeMode === "light" ? "light" : "dark",
      primary: {
        main: "#1d7cc8",
      },
      secondary: {
        main: "#ad5eaf",
      },
    },
  });

  return { theme, changeTheme };
};
