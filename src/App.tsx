import React, {useReducer, useState} from 'react';
import './App.css';
import {FilterValueType, TaskPropsType, Todolist} from "./components/Todolist/Todolist";
import {v1} from 'uuid';
import {createTheme, ThemeProvider} from '@mui/material/styles'
import {AddItemForm} from "./components/AddItemForm/AddItemForm";
import {useAutoAnimate} from "@formkit/auto-animate/react";

import Toolbar from "@mui/material/Toolbar";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import AppBar from "@mui/material/AppBar";
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import DeleteIcon from "@mui/icons-material/Delete";

import Switch from '@mui/material/Switch'
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
  const todolistId1 = v1();
  const todolistId2 = v1();

  // for style
  const [listRef] = useAutoAnimate<HTMLUnknownElement>()
  const [themeMode, setThemeMode] = useState<ThemeMode>('light')

  const [todoLists, dispatchTodoLists] = useReducer(todolistsReducer, [
    {id: todolistId1, title: 'What to learn', filter: 'all'},
    {id: todolistId2, title: 'What to buy', filter: 'all'},
  ])
  const [tasks, dispatchTasks] = useReducer(tasksReducer, {
    [todolistId1]: [
      {id: v1(), title: 'HTML&CSS', isDone: true},
      {id: v1(), title: 'JS', isDone: true},
      {id: v1(), title: 'ReactJS', isDone: false},
      {id: v1(), title: 'Redux', isDone: false},
    ],
    [todolistId2]: [
      {id: v1(), title: 'Books', isDone: false},
      {id: v1(), title: 'Juice', isDone: true},
      {id: v1(), title: 'Water', isDone: true},
      {id: v1(), title: 'Apples', isDone: false},
    ],
  });

  function removeTask(id: string, todoId: string) {
    dispatchTasks(removeTaskAC(todoId, id))
  } // + tests

  function removeTodolist(todoId: string) {
    const action = removeTodolistAC(todoId);
    dispatchTodoLists(action)
    dispatchTasks(action)
  } // + tests

  function removeAllTodoLists() {
    const action = removeAllTodoListsAC();
    dispatchTodoLists(action)
    dispatchTasks(action)
  } // + tests

  function changeFilter(filter: FilterValueType, todoId: string) {
    dispatchTodoLists(changeFilterAC(todoId, filter))
  } // + tests

  function changeTaskStatus(isDone: boolean, taskId: string, todoId: string) {
    dispatchTasks(changeTaskStatusAC(todoId, taskId, isDone))
  } // + tests

  function addTask(title: string, todoId: string) {
    dispatchTasks(addNewTaskAC(todoId, title))
  } // + tests

  function addTodoList(title: string) {
    const todoId = v1();
    const action = addNewTodolistAC(title, todoId);
    dispatchTodoLists(action)
    dispatchTasks(action)
  } // + tests

  function changeTitleTodolist(title: string, todoId: string) {
    dispatchTodoLists(changeTitleAC(todoId, title))
  } // + tests

  function changeTitleTask(value: string, taskId: string, todoId: string) {
    dispatchTasks(changeTaskTitleAC(todoId, taskId, value))
  } // + tests

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
      let filteredTasks = tasks[tl.id];

      if (tl.filter === 'active') {
        filteredTasks = filteredTasks.filter((t) => !t.isDone);
      }
      if (tl.filter === 'completed') {
        filteredTasks = filteredTasks.filter((t) => t.isDone);
      }

      return (
        <Grid>
          <Paper elevation={3} sx={{p: '0 20px 20px 20px'}}>
            <Todolist
              key={tl.id}
              id={tl.id}
              filter={tl.filter}
              title={tl.title}
              tasks={filteredTasks}
              changeFilter={changeFilter}
              removeTask={removeTask}
              removeTodolist={removeTodolist}
              changeTaskStatus={changeTaskStatus}
              addTask={addTask}
              changeTitleTodolist={changeTitleTodolist}
              changeTitleTask={changeTitleTask}
            />
          </Paper>
        </Grid>
      )
    })

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <AppBar position="static" sx={{mb: '30px'}}>
          <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{mr: 2}}
            >
              <MenuIcon/>
            </IconButton>
            <div>
              <Button color="inherit">Login</Button>
              <Button color="inherit">Logout</Button>
              <Button color="inherit">Faq</Button>
              <Switch color={'default'} onChange={changeModeHandler}/>
            </div>
          </Toolbar>
        </AppBar>

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
