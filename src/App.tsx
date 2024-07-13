import React, {useCallback, useReducer, useState} from 'react';
import './App.css';
import {FilterValueType, TaskPropsType, Todolist} from "./components/Todolist/Todolist";
import {v1} from 'uuid';
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
  addNewTodolistAC,
  changeFilterAC,
  changeTitleAC,
  removeAllTodoListsAC,
  removeTodolistAC,
  todolistsReducer
} from "./state/todolists/todolistsReducer";
import {
  addNewTaskAC,
  changeTaskStatusAC,
  changeTaskTitleAC,
  removeTaskAC,
  tasksReducer
} from "./state/tasks/tasksReducer";
import {AppHead} from "./components/AppHead/AppHead";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";

export type TodolistType = {
  id: string
  title: string
  filter: FilterValueType
}

type ThemeMode = 'dark' | 'light'

export type TasksStateType = {
  [key: string]: TaskPropsType[]
}

function App() {

  // for style
  const [listRef] = useAutoAnimate<HTMLUnknownElement>()
  const [themeMode, setThemeMode] = useState<ThemeMode>('light')

  const todoLists = useSelector<AppRootStateType,TodolistType[]>(state => state.todolists)
  const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
  const dispatch = useDispatch();

  const removeTask = useCallback((id: string, todoId: string) => {
    dispatch(removeTaskAC(todoId, id))
  } , []) // + tests

  const removeTodolist = useCallback((todoId: string) => {
    dispatch(removeTodolistAC(todoId))
  }, []) // + tests

  const removeAllTodoLists = useCallback(() => {
    dispatch(removeAllTodoListsAC())
  }, []) // + tests

  const changeFilter = useCallback((filter: FilterValueType, todoId: string) => {
    dispatch(changeFilterAC(todoId, filter))
  }, []) // + tests

  const changeTaskStatus = useCallback((isDone: boolean, taskId: string, todoId: string) => {
    dispatch(changeTaskStatusAC(todoId, taskId, isDone))
  }, []) // + tests

  const addTask = useCallback((title: string, todoId: string) => {
    dispatch(addNewTaskAC(todoId, title))
  }, []) // + tests

  const addTodoList = useCallback((title: string) => {
    const todoId = v1();
    dispatch(addNewTodolistAC(title, todoId))
  }, []) // + tests

  const changeTitleTodolist = useCallback((title: string, todoId: string) => {
    dispatch(changeTitleAC(todoId, title))
  }, []) // + tests

  const changeTaskTitle = useCallback((value: string, taskId: string, todoId: string) => {
    dispatch(changeTaskTitleAC(todoId, taskId, value))
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
              changeTaskStatus={changeTaskStatus}
              addTask={addTask}
              changeTitleTodolist={changeTitleTodolist}
              changeTitleTask={changeTaskTitle}
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
