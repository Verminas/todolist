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

  const [todoLists, setTodoLists] = useState<TodolistType[]>([
    {id: todolistId1, title: 'What to learn', filter: 'all'},
    {id: todolistId2, title: 'What to buy', filter: 'all'},
  ])
  const [tasks, setTasks] = useState({
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
      <StyledWrapper>{todoListsElements}</StyledWrapper>
    </div>
  );
}

const StyledWrapper = styled.div`
    display: flex;
    gap: 30px;
`

export default App;
