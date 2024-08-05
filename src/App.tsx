import React, {useCallback, useEffect, useState} from 'react';
import './App.css';
import {Todolist} from "./components/Todolist/Todolist";
import {createTheme, ThemeProvider} from '@mui/material/styles'
import {AddItemForm} from "./components/AddItemForm/AddItemForm";
import {useAutoAnimate} from "@formkit/auto-animate/react";

import Paper from "@mui/material/Paper";
import Button from '@mui/material/Button';
import DeleteIcon from "@mui/icons-material/Delete";
import CssBaseline from '@mui/material/CssBaseline'

import Container from '@mui/material/Container'
//❗С релизом новой версии import Grid скорее всего изменится (см. документацию)
import Grid from '@mui/material/Unstable_Grid2'
import {
  changeFilterAC,
  fetchTodolistsTC,
  FilterValueType,
  removeTodolistTC,
  TodolistType,
  createTodolistTC,
  removeAllTodolistsTC,
  changeTitleTodolistTC
} from "./state/reducers/todolistsReducer";
import {removeTaskTC, TasksStateType, createTaskTC, updateTaskTC} from "./state/reducers/tasksReducer";
import {AppHead} from "./components/AppHead/AppHead";
import {useSelector} from "react-redux";
import {AppRootStateType, useAppDispatch} from "./state/store";


type ThemeMode = 'dark' | 'light'

function App() {
  console.log('app')

  // for style
  const [listRef] = useAutoAnimate<HTMLUnknownElement>()
  const [themeMode, setThemeMode] = useState<ThemeMode>('light')

  const todoLists = useSelector<AppRootStateType, TodolistType[]>(state => state.todolists)
  const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTodolistsTC())
  }, []);

  const removeTask = useCallback((id: string, todoId: string) => {
    dispatch(removeTaskTC(todoId, id))
  }, []) // + tests

  const removeTodolist = useCallback((todoId: string) => {
    dispatch(removeTodolistTC(todoId))
  }, []) // + tests

  const removeAllTodoLists = useCallback(() => {
    dispatch(removeAllTodolistsTC())
  }, []) // + tests

  const changeFilter = useCallback((filter: FilterValueType, todoId: string) => {
    dispatch(changeFilterAC(todoId, filter))
  }, []) // + tests


  const updateTask = useCallback((todoId: string, taskId: string, title: string, isDone: boolean) => {
    dispatch(updateTaskTC(todoId, taskId, title, isDone))
  }, [])

  const addTask = useCallback((title: string, todoId: string) => {
    dispatch(createTaskTC(todoId, title))
  }, []) // + tests

  const addTodoList = useCallback((title: string) => {
    dispatch(createTodolistTC(title))
  }, []) // + tests

  const changeTitleTodolist = useCallback((title: string, todoId: string) => {
    dispatch(changeTitleTodolistTC(todoId, title))
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


  const todoListsElements = todoLists.length === 0
    ? <span>There are no todolists</span>
    : todoLists.map(tl => {

      return (
        <Grid key={tl.id}>
          <Paper elevation={3} sx={{p: '0 20px 20px 20px'}}>
            <Todolist
              id={tl.id}
              filter={tl.filter}
              title={tl.title}
              tasks={tasks[tl.id]}


              changeFilter={changeFilter}
              removeTask={removeTask}
              removeTodolist={removeTodolist}
              addTask={addTask}
              changeTitleTodolist={changeTitleTodolist}
              updateTask={updateTask}
            />
          </Paper>
        </Grid>
      )
    })

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <AppHead switchOnChange={changeModeHandler}/>

        <Container fixed>
          <Grid container sx={{mb: '30px', flexDirection: 'column', alignItems: 'baseline'}}>
            <AddItemForm addItem={addTodoList} placeholder={'Add a new todolists...'} textFieldLabel={'New todolists'}/>
            <Button children={'DELETE ALL TODOLISTS'} onClick={removeAllTodoLists} variant="outlined"
                    endIcon={<DeleteIcon/>} color={'primary'} sx={{mt: '10px'}}/>
          </Grid>
          <Grid container spacing={4} ref={listRef}>
            {todoListsElements}
          </Grid>
        </Container>

      </ThemeProvider>
    </div>
  );
}

export default App;
