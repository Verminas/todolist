import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import './App.css';
import {FilterValueType, TaskPropsType, Todolist} from "./components/Todolist/Todolist";
import {v1} from 'uuid';
import {Button} from "./components/Button/Button";
import styled from "styled-components";

type TodolistType = {
  id: string
  title: string
  filter: FilterValueType
}

function App() {
  const todolistId1 = v1();
  const todolistId2 = v1();

  const tasksObj = {
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
  }


  const [todoLists, setTodoLists] = useState<TodolistType[]>([
    {id: todolistId1, title: 'What to learn', filter: 'active'},
    {id: todolistId2, title: 'What to buy', filter: 'completed'},
  ])
  const [tasks, setTasks] = useState(tasksObj);

  function removeTask(id: string, todoId: string) {
    tasks[todoId] = tasks[todoId].filter((t) => t.id !== id);
    setTasks({...tasks});
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

  function changeFilter(value: FilterValueType, todoId: string) {
    let tl = todoLists.find(t => t.id === todoId);
    if (tl) {
      tl.filter = value;
      setTodoLists([...todoLists])
    }
  }

  function changeTaskStatus(e: ChangeEvent<HTMLInputElement>, taskId: string, todoId: string) {
    let task = tasks[todoId].find((t) => t.id === taskId);
    if (task) {
      task.isDone = e.currentTarget.checked;
    }
    setTasks({...tasks});
  }

  function addTask(titleTask: string, todoId: string) {
    let newTask: TaskPropsType = {
      id: v1(),
      title: titleTask.trim(),
      isDone: false,
    }
    tasks[todoId] = [newTask, ...tasks[todoId]]
    setTasks({...tasks})
  }


  const todolistsElements = todoLists.length === 0
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
      />
    )
  })

  return (
    <div className="App">
      <Button title={'DELETE ALL TODOLISTS'} onClick={removeAllTodoLists}/>
      <StyledWrapper>{todolistsElements}</StyledWrapper>
    </div>
  );
}

const StyledWrapper = styled.div`
    display: flex;
    gap: 30px;
`

export default App;
