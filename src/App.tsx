import React from 'react';
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
  const tasksList2 = {
    title: 'What to but',
    tasks: [
      {id: v1(), title: 'book', isDone: false},
      {id: v1(), title: 'bread', isDone: false},
      {id: v1(), title: 'bear', isDone: true},
    ],
  }
  const tasksList3 = {
    title: 'What to do',
    tasks: [
      {id: v1(), title: 'clean bathroom', isDone: true},
      {id: v1(), title: 'go shopping', isDone: true},
      {id: v1(), title: 'go for a wolk', isDone: false},
      {id: v1(), title: 'meet with friends', isDone: true},
    ],
  }

  function removeTask(id: string, array: Array<TaskPropsType>, setFunc: (value: Array<TaskPropsType>) => void) {
    let filteredTasks = array.filter((t) => t.id !== id);
    setFunc(filteredTasks);
  }

  function changeFilter(value: FilterValueType, setFunc: (value: FilterValueType) => void) {
    setFunc(value);
  }

  return (
    <div className="App">
      <Todolist
        data={tasksList1}
        changeFilter={changeFilter}
        removeTask={removeTask}
      />
      <Todolist
        data={tasksList2}
        changeFilter={changeFilter}
        removeTask={removeTask}
      />
      <Todolist
        data={tasksList3}
        changeFilter={changeFilter}
        removeTask={removeTask}
      />
    </div>
  );
}

export default App;
