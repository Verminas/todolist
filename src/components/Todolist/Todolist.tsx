import React, {ChangeEvent} from 'react';
import {Button} from "../Button/Button";
import {useAutoAnimate} from "@formkit/auto-animate/react";
import styled from "styled-components";
import {AddItemForm} from "../AddItemForm/AddItemForm";

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
  addTask: (value: string, todoId: string) => void
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

    // animation for list tasks
    const [listRef] = useAutoAnimate<HTMLUListElement>()

    const addTaskHandler = (value: string) => {
      addTask(value, id)
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
        <AddItemForm addItem={addTaskHandler}/>
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