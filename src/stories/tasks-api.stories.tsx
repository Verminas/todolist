import React, {useEffect, useState} from 'react'
import axios from "axios";
import {todolistAPI} from "../api/todolist-api";
import {taskAPI} from "../api/task-api";

export default {
  title: 'API Tasks',
}



export const GetTasks = () => {
  const [state, setState] = useState<any>(null)
  const todoID = 'b99dbdd9-b81e-4680-aa7e-9ed553f81dbd'
  useEffect(() => {
    taskAPI.getTasks(todoID)
      .then(res => {
        setState(res.data)
      })
  }, [])
  return <div>{JSON.stringify(state)}</div>
}

export const CreateTask = () => {
  const [state, setState] = useState<any>(null)
  const todoID = 'b99dbdd9-b81e-4680-aa7e-9ed553f81dbd'
  const newTitle = `New Task ${new Date().toISOString()}`
  useEffect(() => {
    taskAPI.createTask(todoID, newTitle)
      .then(res => {
        setState(res.data)
      })
  }, [])

  return <div>{JSON.stringify(state)}</div>
}

export const DeleteTask = () => {
  const [state, setState] = useState<any>(null)
  const todoID = 'b99dbdd9-b81e-4680-aa7e-9ed553f81dbd'
  const taskID = '857cfd6a-2348-4adc-9926-8cf6e9490a9a'
  useEffect(() => {
    taskAPI.deleteTask(todoID, taskID)
      .then(res => {
        setState(res.data)
      })
  }, [])

  return <div>{JSON.stringify(state)}</div>
}

export const UpdateTaskTitle = () => {
  const [state, setState] = useState<any>(null)
  const todoID = 'b99dbdd9-b81e-4680-aa7e-9ed553f81dbd'
  const taskID = '2acdf418-3e09-43ec-831a-6889a3e5eb7b'
  const newTitle = 'New title for todo'
  useEffect(() => {
    taskAPI.updateTask(todoID, taskID, newTitle)
      .then(res => {
        setState(res.data)
      })
  }, [])

  return <div>{JSON.stringify(state)}</div>
}