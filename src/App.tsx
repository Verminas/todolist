import React from 'react';
import './App.css';
import {Todolist} from "./components/Todolist/Todolist";

function App() {
  const tasksList = {
      title: 'What to learn',
      tasks: [
          {id: 1, title: 'HTML&CSS', isDone: true},
          {id: 2, title: 'JS', isDone: true},
          {id: 3, title: 'ReactJS', isDone: false},
          {id: 4, title: 'Redux', isDone: false},
      ],
  }

  return (
    <div className="App">
      <Todolist title={tasksList.title} tasks={tasksList.tasks}/>
      <Todolist title={tasksList.title} tasks={tasksList.tasks}/>
    </div>
  );
}

export default App;
