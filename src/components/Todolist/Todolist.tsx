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
  changeTaskStatus: (e: ChangeEvent<HTMLInputElement>, taskId: string) => void
  addTask: (inputValue: string) => void
  filter: FilterValueType
}

export const Todolist = ({
                           title,
                           tasks,
                           changeFilter,
                           removeTask,
                           changeTaskStatus,
                           addTask,
                           filter
                         }: TodolistPropsType) => {

  const [titleTask, setTitleTask] = useState('');
  const [errorTitleTask, setErrorTitleTask] = useState<string | null>(null);
  // animation for list tasks
  const [listRef] = useAutoAnimate<HTMLUListElement>()

  function changeInputValueTitle(e: ChangeEvent<HTMLInputElement>) {
    setTitleTask(e.currentTarget.value)
  }

  function onKeyUpEnter(e: KeyboardEvent<HTMLInputElement>) {
    setErrorTitleTask(null);
    if (e.key === 'Enter') {
      addTaskHandler();
    }
  }

  const addTaskHandler = () => {
    if (titleTask.trim().length > 0) {
      addTask(titleTask);
      setTitleTask('');
    } else {
      setErrorTitleTask('Title is required')
    }
  }

  const tasksElements = tasks.map((t) => {
    const removeTaskHandler = () => {
      removeTask(t.id)
    }
    const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
      changeTaskStatus(e, t.id);
    }

    return (
      <Task key={t.id} className={t.isDone ? 'is-done' : ''}>
        <input type="checkbox" checked={t.isDone} onChange={changeTaskStatusHandler}/>
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
          value={titleTask}
          onChange={changeInputValueTitle}
          onKeyUp={onKeyUpEnter}
          className={errorTitleTask ? 'input-error' : ''}
        />
        <Button title={'+'} onClick={addTaskHandler}/>
      </div>
      {errorTitleTask && <ErrorMessage>{errorTitleTask}</ErrorMessage>}
      {tasks.length === 0
        ? <span>There are not tasks</span>
        : <ul ref={listRef}>
          {tasksElements}
        </ul>
      }
      <div>
        <Button title={'All'} onClick={() => changeFilter('all')}
                className={filter === 'all' ? 'active-filter' : ''}/>
        <Button title={'Active'} onClick={() => changeFilter('active')}
                className={filter === 'active' ? 'active-filter' : ''}/>
        <Button title={'Completed'} onClick={() => changeFilter('completed')}
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