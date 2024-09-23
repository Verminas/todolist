import React, { useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsInitialized } from "app/appSlice";
import { useActions, useTheme } from "common/hooks";
import { AppHead, ErrorSnackbar, Spinner } from "common/components";

function App() {
  const { theme, changeTheme } = useTheme("light");
  const isInitialized = useSelector(selectIsInitialized);
  const { initializeApp } = useActions();

  useEffect(() => {
    initializeApp();
  }, []);

  if (!isInitialized) {
    return <Spinner />;
  }

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorSnackbar />
        <AppHead switchOnChange={changeTheme} />

        <Container fixed>
          <Outlet />
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
