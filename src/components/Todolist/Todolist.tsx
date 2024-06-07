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
  id: string
  title: string
  tasks: Array<TaskPropsType>

  changeFilter: (value: FilterValueType, todoId: string) => void
  removeTask: (id: string, todoId: string) => void
  removeTodolist: (todoId: string) => void
  changeTaskStatus: (checked: boolean, taskId: string, todoId: string) => void
  addTask: (inputValue: string, todoId: string) => void
  filter: FilterValueType
}

export const Todolist = ({
                           id,
                           title,
                           tasks,
                           changeFilter,
                           removeTask,
                           removeTodolist,
                           changeTaskStatus,
                           addTask,
                           filter
                         }:
                           TodolistPropsType
  ) => {

    const [titleTask, setTitleTask] = useState('');
    const [errorTitleTask, setErrorTitleTask] = useState<string | null>(null);
    // animation for list tasks
    const [listRef] = useAutoAnimate<HTMLUListElement>()

    function changeTitleTask(e: ChangeEvent<HTMLInputElement>) {
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
        addTask(titleTask, id);
        setTitleTask('');
      } else {
        setErrorTitleTask('Title is required')
      }
    }

    const changeFilterHandler = (value: FilterValueType) => {
      changeFilter(value, id);
    }

    const removeTodolistHandler = () => {
      removeTodolist(id);
    }

    const tasksElements = tasks.map((t) => {
      const removeTaskHandler = () => {
        removeTask(t.id, id)
      }
      const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
        changeTaskStatus(e.currentTarget.checked, t.id, id);
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
        <WrapperTitle>
          <h3>{title}</h3>
          <Button title={'x'} onClick={removeTodolistHandler}/>
        </WrapperTitle>
        <div>
          <StyledTitleTask
            value={titleTask}
            onChange={changeTitleTask}
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
          <Button title={'All'} onClick={() => changeFilterHandler('all')}
                  className={filter === 'all' ? 'active-filter' : ''}/>
          <Button title={'Active'} onClick={() => changeFilterHandler('active')}
                  className={filter === 'active' ? 'active-filter' : ''}/>
          <Button title={'Completed'} onClick={() => changeFilterHandler('completed')}
                  className={filter === 'completed' ? 'active-filter' : ''}/>
        </div>
      </div>
    );
  }
;

const StyledTitleTask = styled.input`
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

const WrapperTitle = styled.div`
    display: flex;
    align-items: baseline;
    gap: 10px;
`