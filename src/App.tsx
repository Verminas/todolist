import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import './App.css';
import {FilterValueType, TaskPropsType, Todolist} from "./components/Todolist/Todolist";
import { v1 } from 'uuid';

function App() {
  const tasksList1 = {
    title: 'What to learn',
    tasks: [
      {id: v1(), title: 'HTML&CSS', isDone: true},
      {id: v1(), title: 'JS', isDone: true},
      {id: v1(), title: 'ReactJS', isDone: false},
      {id: v1(), title: 'Redux', isDone: false},
    ],
  }

  const [currentTasks, setCurrentTasks] = useState<Array<TaskPropsType>>(tasksList1.tasks);
  const [filter, setFilter] = useState<FilterValueType>('all');

  let todolistTasks = currentTasks;

  if (filter === 'active') {
    todolistTasks = currentTasks.filter((t) => !t.isDone);
  }
  if (filter === 'completed') {
    todolistTasks = currentTasks.filter((t) => t.isDone);
  }

  function removeTask(id: string) {
    let filteredTasks = currentTasks.filter((t) => t.id !== id);
    setCurrentTasks(filteredTasks);
  }

  function changeFilter(value: FilterValueType) {
    setFilter(value);
  }


  function changeInputCheckedTask(e: ChangeEvent<HTMLInputElement>, taskId: string) {
    let task = currentTasks.find((t) => t.id === taskId);
    if (task) {
      task.isDone = e.currentTarget.checked;
    }
    setCurrentTasks([...currentTasks]);
  }

  function addTask(inputValue: string) {
      let newTask: TaskPropsType = {
        id: v1(),
        title: inputValue.trim(),
        isDone: false,
      }
      setCurrentTasks([newTask, ...currentTasks])
  }


  return (
    <div className="App">
      <Todolist
        title={tasksList1.title}
        tasks={todolistTasks}
        changeFilter={changeFilter}
        removeTask={removeTask}
        changeInputCheckedTask={changeInputCheckedTask}
        addTask={addTask}
        filter={filter}
      />
    </div>
  );
}

export default App;
