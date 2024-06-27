import {TasksStateType, TodolistType} from "../../App";
import {TaskPropsType} from "../../components/Todolist/Todolist";
import {v1} from "uuid";
import {
  AddNewTodolistActionType,
  RemoveAllTodoListsActionType,
  RemoveTodolistActionType
} from "../todolists/todolistsReducer";

type TasksReducerActionType =
  RemoveTaskActionType
  | ChangeTaskStatusActionType
  | AddNewTaskActionType
  | ChangeTaskTitleActionType
  | AddNewTodolistActionType
  | RemoveTodolistActionType
  | RemoveAllTodoListsActionType

export type RemoveTaskActionType = {
  type: 'REMOVE-TASK'
  payload: {
    todoId: string
    taskId: string
  }
}

export const removeTaskAC = (todoId: string, taskId: string): RemoveTaskActionType => ({
  type: 'REMOVE-TASK',
  payload: {
    todoId,
    taskId
  }
})

export type ChangeTaskStatusActionType = {
  type: 'CHANGE-TASK-STATUS'
  payload: {
    todoId: string
    taskId: string
    isDone: boolean
  }
}

export const changeTaskStatusAC = (todoId: string, taskId: string, isDone: boolean): ChangeTaskStatusActionType => ({
  type: 'CHANGE-TASK-STATUS',
  payload: {
    todoId,
    taskId,
    isDone
  }
})

export type AddNewTaskActionType = {
  type: 'ADD-NEW-TASK'
  payload: {
    todoId: string
    title: string
  }
}

export const addNewTaskAC = (todoId: string, title: string): AddNewTaskActionType => ({
  type: 'ADD-NEW-TASK',
  payload: {
    todoId,
    title
  }
})

export type ChangeTaskTitleActionType = {
  type: 'CHANGE-TASK-TITLE'
  payload: {
    todoId: string
    taskId: string
    title: string
  }
}

export const changeTaskTitleAC = (todoId: string, taskId: string, title: string): ChangeTaskTitleActionType => ({
  type: 'CHANGE-TASK-TITLE',
  payload: {
    todoId,
    taskId,
    title
  }
})


export const tasksReducer = (state: TasksStateType, action: TasksReducerActionType): TasksStateType => {
  switch (action.type) {

    case "REMOVE-TASK":
      return {
        ...state,
        [action.payload.todoId]: state[action.payload.todoId].filter(t => t.id !== action.payload.taskId)
      };

    case "CHANGE-TASK-STATUS":
      return {
        ...state,
        [action.payload.todoId]: state[action.payload.todoId].map(t => t.id === action.payload.taskId ? {
          ...t,
          isDone: action.payload.isDone
        } : t)
      }

    case "ADD-NEW-TASK":
      const newTask: TaskPropsType = {
        id: v1(),
        title: action.payload.title,
        isDone: false,
      }

      return {...state, [action.payload.todoId]: [newTask, ...state[action.payload.todoId]]};

    case "CHANGE-TASK-TITLE":
      return {
        ...state,
        [action.payload.todoId]: state[action.payload.todoId].map(t => t.id === action.payload.taskId ? {
          ...t,
          title: action.payload.title
        } : t)
      }

    case "ADD-NEW-TODOLIST":
      return {...state, [action.payload.todoId]: []};

    case 'REMOVE-TODOLIST':
      const stateCopy = {...state}
      delete stateCopy[action.payload.todoId];
      return stateCopy;

    case "REMOVE-ALL-TODOLISTS":
      return {};

    default:
      throw new Error(`Unknown tasks action type: ${action}`);
  }
}