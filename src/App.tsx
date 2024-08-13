import React, {useCallback, useEffect, useState} from 'react';
import './App.css';
import {createTheme, ThemeProvider} from '@mui/material/styles'
import {AddItemForm} from "./components/AddItemForm/AddItemForm";
import {useAutoAnimate} from "@formkit/auto-animate/react";

import Button from '@mui/material/Button';
import DeleteIcon from "@mui/icons-material/Delete";
import CssBaseline from '@mui/material/CssBaseline'

import Container from '@mui/material/Container'
//❗С релизом новой версии import Grid скорее всего изменится (см. документацию)
import Grid from '@mui/material/Unstable_Grid2'
import {
  fetchTodolistsTC,
  createTodolistTC,
  removeAllTodolistsTC,
} from "./state/reducers/todolistsReducer";
import {AppHead} from "./components/AppHead/AppHead";
import {useAppDispatch} from "./state/store";
import {ErrorSnackbar} from "./components/ErrorSnackbar/ErrorSnackbar";
import {TodolistsList} from "./components/TodolistsList/TodolistsList";


type ThemeMode = 'dark' | 'light'

function App() {
  console.log('app')

  // for style
  const [listRef] = useAutoAnimate<HTMLUnknownElement>()
  const [themeMode, setThemeMode] = useState<ThemeMode>('light')

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTodolistsTC())
  }, []);

  const removeAllTodoLists = useCallback(() => {
    dispatch(removeAllTodolistsTC())
  }, []) // + tests

  const addTodoList = useCallback((title: string) => {
    dispatch(createTodolistTC(title))
  }, []) // + tests

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


  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <ErrorSnackbar/>
        <AppHead switchOnChange={changeModeHandler}/>

        <Container fixed>
          <Grid container sx={{mb: '30px', flexDirection: 'column', alignItems: 'baseline'}}>
            <AddItemForm addItem={addTodoList} placeholder={'Add a new todolists...'} textFieldLabel={'New todolists'} disabled={false}/>
            <Button children={'DELETE ALL TODOLISTS'} onClick={removeAllTodoLists} variant="outlined"
                    endIcon={<DeleteIcon/>} color={'primary'} sx={{mt: '10px'}}/>
          </Grid>
          <Grid container spacing={4} ref={listRef}>
            <TodolistsList/>
          </Grid>
        </Container>

      </ThemeProvider>
    </div>
  );
}

export default App;