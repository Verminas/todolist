import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import './App.css';
import {FilterValueType, TaskPropsType, Todolist} from "./components/Todolist/Todolist";
import {v1} from 'uuid';
import styled from "styled-components";
import {AddItemForm} from "./components/AddItemForm/AddItemForm";
import {useAutoAnimate} from "@formkit/auto-animate/react";
import {AppBar, IconButton, Paper, Toolbar, Typography} from "@mui/material";
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import DeleteIcon from "@mui/icons-material/Delete";

import Container from '@mui/material/Container'
//❗С релизом новой версии import Grid скорее всего изменится (см. документацию)
import Grid from '@mui/material/Unstable_Grid2'

type TodolistType = {
  id: string
  title: string
  filter: FilterValueType
}

export type TasksStateType = {
  [key: string]: TaskPropsType[]
}

function App() {
  const todolistId1 = v1();
  const todolistId2 = v1();

  // for style
  const [listRef] = useAutoAnimate<HTMLUnknownElement>()

  const [todoLists, setTodoLists] = useState<TodolistType[]>([
    {id: todolistId1, title: 'What to learn', filter: 'all'},
    {id: todolistId2, title: 'What to buy', filter: 'all'},
  ])
  const [tasks, setTasks] = useState<TasksStateType>({
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
    setTasks({...tasks, [todoId]: tasks[todoId].filter(t => t.id !== id)})
  }

  function removeTodolist(todoId: string) {
    setTodoLists([...todoLists.filter(t => t.id !== todoId)]);
    delete tasks[todoId];
    setTasks({...tasks})
  }

  function removeAllTodoLists() {
    todoLists.forEach(t => {
      delete tasks[t.id];
    })
    setTasks({...tasks});
    setTodoLists([])
  }

  function changeFilter(filter: FilterValueType, todoId: string) {
    setTodoLists(todoLists.map(tl => tl.id === todoId ? {...tl, filter} : tl))
  }

  function changeTaskStatus(checked: boolean, taskId: string, todoId: string) {
    setTasks({...tasks, [todoId]: tasks[todoId].map(t => t.id === taskId ? {...t, isDone: checked} : t)})
  }

  function addTask(titleTask: string, todoId: string) {
    let newTask: TaskPropsType = {
      id: v1(),
      title: titleTask.trim(),
      isDone: false,
    }

    setTasks({...tasks, [todoId]: [newTask, ...tasks[todoId]]})
  }

  function addTodoList(titleTodoList: string) {
    const newTodoList: TodolistType = {
      id: v1(),
      title: titleTodoList,
      filter: 'all',
    }
    setTasks({...tasks, [newTodoList.id]: []})
    setTodoLists([newTodoList, ...todoLists])
  }

  function changeTitleTodolist(value: string, todoId: string) {
    setTodoLists(todoLists.map(tl => tl.id === todoId ? {...tl, title: value} : tl))
  }

  function changeTitleTask(value: string, taskId: string, todoId: string) {
    setTasks({...tasks, [todoId]: tasks[todoId].map(t => t.id === taskId ? {...t, title: value} : t)})
  }


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
          <Paper elevation={3} sx={{ p: '0 20px 20px 20px' }}>
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
      <AppBar position="static" sx={{ mb: '30px' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
          </div>
        </Toolbar>
      </AppBar>

      <Container fixed>
        <Grid container sx={{ mb: '30px', flexDirection: 'column', alignItems: 'baseline'}}>
          <AddItemForm addItem={addTodoList} placeholder={'Add a new todolist...'} textFieldLabel={'New todolist'}/>
          <Button children={'DELETE ALL TODOLISTS'} onClick={removeAllTodoLists} variant="outlined"
                  endIcon={<DeleteIcon/>} color={'primary'} sx={{mt: '10px'}}/>
        </Grid>
        <Grid container spacing={4} ref={listRef}>
          {todoListsElements}
        </Grid>
      </Container>
    </div>
  );
}

export default App;
