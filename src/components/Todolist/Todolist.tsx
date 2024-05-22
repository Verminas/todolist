import React, {useState} from 'react';
import {Button} from "../Button/Button";

type TaskPropsType = {
  id: number
  title: string
  isDone: boolean
}

type TodolistPropsType = {
  title: string
  tasks: Array<TaskPropsType>
}

export const Todolist = ({title, tasks}: TodolistPropsType) => {
  const [currentTasks, setCurrentTasks] = useState(tasks);
  const [filter, setFilter] = useState('all');

  function removeTask(id: number) {
    let filteredTasks = currentTasks.filter((t) => t.id !== id);
    setCurrentTasks(filteredTasks);
  }

  function changeFilter(value: string) {
    setFilter(value);
  }

  let filteredTasks = currentTasks;
  if (filter === 'active') {
    filteredTasks = currentTasks.filter((t) => !t.isDone);
  }
  if (filter === 'completed') {
    filteredTasks = currentTasks.filter((t) => t.isDone);
  }

  const tasksElements = filteredTasks.map((t) => {
    return (
      <li key={t.id}>
        <input type="checkbox" checked={t.isDone}/>
        <span>{t.title}</span>
        <Button title={'x'} onClick={() => removeTask(t.id)}/>
      </li>
    )
  })

  return (
    <div>
      <h3>{title}</h3>
      <div>
        <input/>
        <Button title={'+'}/>
      </div>
      {currentTasks.length === 0
        ? <span>There are not tasks</span>
        : <ul>
          {tasksElements}
        </ul>
      }
      <div>
        <Button title={'All'} onClick={() => changeFilter('all')}/>
        <Button title={'Active'} onClick={() => changeFilter('active')}/>
        <Button title={'Completed'} onClick={() => changeFilter('completed')}/>
      </div>
    </div>
  );
};