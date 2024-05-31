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
  title: string
  tasks: Array<TaskPropsType>

  changeFilter: (value: FilterValueType) => void
  removeTask: (id: string) => void
  changeInputCheckedTask: (e: ChangeEvent<HTMLInputElement>, taskId: string) => void
  addTask: (inputValue: string) => void
  filter: FilterValueType
}

export const Todolist = ({
                           title, tasks,
                           changeFilter,
                           removeTask,
                           changeInputCheckedTask,
                           addTask,
                           filter
                         }: TodolistPropsType) => {

  const [inputValue, setInputValue] = useState('');
  const [errorInputTitle, setErrorInputTitle] = useState<string | null>(null);
  // animation for list tasks
  const [listRef] = useAutoAnimate<HTMLUListElement>()

  function changeInputValueTitle(e: ChangeEvent<HTMLInputElement>) {
    setInputValue(e.currentTarget.value)
  }

  function onKeyUpEnter(e: KeyboardEvent<HTMLInputElement>) {
    setErrorInputTitle(null);
    if (e.key === 'Enter') {
      addTaskHandler();
    }
  }

  const changeFilterHandler = (value: FilterValueType) => {
    changeFilter(value)
  }


  const addTaskHandler = () => {
    if (inputValue.trim().length > 0) {
      addTask(inputValue);
      setInputValue('');
    } else {
      setErrorInputTitle('Title is required')
    }
  }

  const tasksElements = tasks.map((t) => {
    const removeTaskHandler = () => {
      removeTask(t.id)
    }
    const changeInputCheckedTaskHandler = (e: ChangeEvent<HTMLInputElement>) => {
      changeInputCheckedTask(e, t.id);
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
          onChange={changeInputValueTitle}
          onKeyUp={onKeyUpEnter}
          className={errorInputTitle ? 'input-error' : ''}
        />
        <Button title={'+'} onClick={addTaskHandler}/>
      </div>
      {errorInputTitle && <ErrorMessage>{errorInputTitle}</ErrorMessage>}
      {tasks.length === 0
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
    &.is-done {
        opacity: 0.5;
    }
`