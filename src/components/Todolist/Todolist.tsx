import React, {ChangeEvent, ChangeEventHandler, KeyboardEvent, useState} from 'react';
import {Button} from "../Button/Button";
import {v1} from "uuid";
import {useAutoAnimate} from "@formkit/auto-animate/react";
import styled from "styled-components";

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
  changeInputValueTitle: (e: ChangeEvent<HTMLInputElement>, setFunc: (value: string) => void) => void
  changeInputCheckedTask: (e: ChangeEvent<HTMLInputElement>,
                           taskId: string,
                           tasks:Array<TaskPropsType>,
                           setFunc: (value: Array<TaskPropsType>) => void) => void
  addTask: (inputValue: string,
            tasks: Array<TaskPropsType>,
            setTasksFunc: (value: Array<TaskPropsType>) => void,
            setInputFunc: (value: string) => void,
            setErrorFunc: (value: string | null) => void) => void
  onKeyUpEnter: (e: KeyboardEvent<HTMLInputElement>, setErrorFunc: (value: string | null) => void, addHandler: () => void) => void
}

export const Todolist = ({data: {title, tasks},
                           changeFilter,
                           removeTask,
                           changeInputValueTitle,
                           changeInputCheckedTask,
                           addTask,
                           onKeyUpEnter}: TodolistPropsType) => {
  const [currentTasks, setCurrentTasks] = useState(tasks);
  const [filter, setFilter] = useState('all');
  const [inputValue, setInputValue] = useState('');
  const [errorInputTitle, setErrorInputTitle] = useState<string | null>(null);
  // animation for list tasks
  const [listRef] = useAutoAnimate<HTMLUListElement>()

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
  const changeInputValueTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
    changeInputValueTitle(e, setInputValue);
  }
  const addTaskHandler = () => {
    addTask(inputValue, currentTasks, setCurrentTasks, setInputValue, setErrorInputTitle);
  }
  const onKeyUpEnterHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    onKeyUpEnter(e, setErrorInputTitle, addTaskHandler);
  }

  const tasksElements = todolistTasks.map((t) => {
    const removeTaskHandler = () => {
      removeTask(t.id, currentTasks, setCurrentTasks)
    }
    const changeInputCheckedTaskHandler = (e: ChangeEvent<HTMLInputElement>) => {
      changeInputCheckedTask(e, t.id, currentTasks, setCurrentTasks);
    }

    return (
      <Task key={t.id} className={t.isDone ? 'is-done' : ''}>
        <input type="checkbox" checked={t.isDone} onChange={changeInputCheckedTaskHandler}/>
        <span>{t.title}</span>
        <Button title={'x'} onClick={removeTaskHandler}/>
      </Task>
    )
  })

  return (
    <div>
      <h3>{title}</h3>
      <div>
        <StyledInputTitle
          value={inputValue}
          onChange={changeInputValueTitleHandler}
          onKeyUp={onKeyUpEnterHandler}
          className={errorInputTitle ? 'input-error' : ''}
        />
        <Button title={'+'} onClick={addTaskHandler}/>
      </div>
      {errorInputTitle && <ErrorMessage>{errorInputTitle}</ErrorMessage>}
      {todolistTasks.length === 0
        ? <span>There are not tasks</span>
        : <ul ref={listRef}>
          {tasksElements}
        </ul>
      }
      <div>
        <Button title={'All'} onClick={() => changeFilterHandler('all')}
                className={filter === 'all' ? 'active-filter' : ''}/>
        <Button title={'Active'} onClick={() => changeFilterHandler('active')}
                className={filter === 'active' ? 'active-filter' : ''}/>
        <Button title={'Completed'} onClick={() => changeFilterHandler('completed')}
                className={filter === 'completed' ? 'active-filter' : ''}/>
      </div>
    </div>
  );
};

const StyledInputTitle = styled.input`
    &.input-error {
        outline: 1px solid red;
    }
`

const ErrorMessage = styled.span`
    color: red;
`

const Task = styled.li`
    &.is-done{
        opacity: 0.5;
    }
`