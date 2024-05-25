import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {Button} from "../Button/Button";
import {v1} from "uuid";
import {useAutoAnimate} from "@formkit/auto-animate/react";

export type FilterValueType = 'all' | 'active' | 'completed';

export type TaskPropsType = {
  id: string
  title: string
  isDone: boolean
}

type TodolistPropsType = {
  data: {
    title: string
    tasks: Array<TaskPropsType>
  }

  changeFilter: (value: FilterValueType, setFunc: (value: FilterValueType) => void) => void
  removeTask: (id: string, array: Array<TaskPropsType>, setFunc: (value: Array<TaskPropsType>) => void) => void
}

export const Todolist = ({data: {title, tasks}, changeFilter, removeTask}: TodolistPropsType) => {
  const [currentTasks, setCurrentTasks] = useState(tasks);
  const [filter, setFilter] = useState('all');
  const [inputValue, setInputValue] = useState('');
  // animation for list tasks
  const [listRef] = useAutoAnimate<HTMLUListElement>()

  function changeInputValueTitle(e: ChangeEvent<HTMLInputElement>){
    setInputValue(e.currentTarget.value)
  }
  function changeInputCheckedTask() {

  }

  function addTask() {
    if (inputValue.trim().length > 0) {
      let newTask: TaskPropsType = {
        id: v1(),
        title: inputValue,
        isDone: false,
      }
      setCurrentTasks([newTask, ...currentTasks])
      setInputValue('');
    }
  }

  function onKeyUpEnter(e: KeyboardEvent<HTMLInputElement>) {
      if(e.key === 'Enter') {
        addTask();
      }
  }

  let todolistTasks = currentTasks;
  if (filter === 'active') {
    todolistTasks = currentTasks.filter((t) => !t.isDone);
  }
  if (filter === 'completed') {
    todolistTasks = currentTasks.filter((t) => t.isDone);
  }

  const changeFilterHandler = (value: FilterValueType) => {
    changeFilter(value, setFilter)
  }

  const tasksElements = todolistTasks.map((t) => {
    const removeTaskHandler = () => {
      removeTask(t.id, currentTasks, setCurrentTasks)
    }

    return (
      <li key={t.id}>
        <input type="checkbox" checked={t.isDone} onChange={() =>console.log(t.id)}/>
        <span>{t.title}</span>
        <Button title={'x'} onClick={removeTaskHandler}/>
      </li>
    )
  })

  return (
    <div>
      <h3>{title}</h3>
      <div>
        <input
          value={inputValue}
          onChange={changeInputValueTitle}
          onKeyUp={onKeyUpEnter}
        />
        <Button title={'+'} onClick={addTask}/>
      </div>
      {todolistTasks.length === 0
        ? <span>There are not tasks</span>
        : <ul ref={listRef}>
          {tasksElements}
        </ul>
      }
      <div>
        <Button title={'All'} onClick={() => changeFilterHandler('all')}/>
        <Button title={'Active'} onClick={() => changeFilterHandler('active')}/>
        <Button title={'Completed'} onClick={() => changeFilterHandler('completed')}/>
      </div>
    </div>
  );
};