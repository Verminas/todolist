import React, { useEffect, useState } from "react";
import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import { AppHead } from "common/components/AppHead/AppHead";
import { ErrorSnackbar } from "common/components/ErrorSnackbar/ErrorSnackbar";
import { Outlet } from "react-router-dom";
import { initializeApp } from "features/auth/authSlice";
import { useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";
import { selectIsInitialized } from "app/appSlice";
import { useAppDispatch } from "common/hooks/useAppDispatch";

type ThemeMode = "dark" | "light";

function App() {
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");
  const dispatch = useAppDispatch();
  const isInitialized = useSelector(selectIsInitialized);

  useEffect(() => {
    dispatch(initializeApp());
  }, []);

  const changeModeHandler = () => {
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

  if (!isInitialized) {
    return (
      <div style={{ position: "fixed", top: "30%", textAlign: "center", width: "100%" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorSnackbar />
        <AppHead switchOnChange={changeModeHandler} />

        <Container fixed>
          <Outlet />
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
