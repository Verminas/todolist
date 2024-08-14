import React, {useEffect, useState} from 'react';
import './App.css';
import {createTheme, ThemeProvider} from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

import Container from '@mui/material/Container'
//❗С релизом новой версии import Grid скорее всего изменится (см. документацию)
import {fetchTodolistsTC} from "./state/reducers/todolistsReducer";
import {AppHead} from "./components/AppHead/AppHead";
import {AppRootStateType, useAppDispatch} from "./state/store";
import {ErrorSnackbar} from "./components/ErrorSnackbar/ErrorSnackbar";
import {Outlet} from "react-router-dom";
import {initializeAppTC} from "./features/Login/authReducer";
import {useDispatch, useSelector} from "react-redux";
import {CircularProgress} from "@mui/material";


type ThemeMode = 'dark' | 'light'

function App() {
  const [themeMode, setThemeMode] = useState<ThemeMode>('light')
  const dispatch = useAppDispatch();
  const isInitialized = useSelector<AppRootStateType, boolean>(state => state.app.isInitialized)

  useEffect(() => {
    dispatch(initializeAppTC())
  }, []);

  const changeModeHandler = () => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light')
  }

  const theme = createTheme({
    palette: {
      mode: themeMode === 'light' ? 'light' : 'dark',
      primary: {
        main: '#1d7cc8',
      },
      secondary: {
        main: '#ad5eaf',
      },
    },
  })

  if (!isInitialized) {
    return (
      <div style={{ position: 'fixed', top: '30%', textAlign: 'center', width: '100%' }}>
        <CircularProgress />
      </div>
    )
  }

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <ErrorSnackbar/>
        <AppHead switchOnChange={changeModeHandler}/>

        <Container fixed>
          <Outlet/>
        </Container>

      </ThemeProvider>
    </div>
  );
}

export default App;