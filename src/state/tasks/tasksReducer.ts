import {TasksStateType, TodolistType} from "../../App";
import {TaskPropsType} from "../../components/Todolist/Todolist";
import {v1} from "uuid";
import {
  AddNewTodolistActionType,
  RemoveAllTodoListsActionType,
  RemoveTodolistActionType, todolistId1, todolistId2
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

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: TasksReducerActionType): TasksStateType => {
  switch (action.type) {

    case "REMOVE-TASK": {
      const {todoId, taskId} = action.payload
      return {
        ...state,
        [todoId]: state[todoId].filter(t => t.id !== taskId)
      };
    }

    case "CHANGE-TASK-STATUS": {
      const {todoId, taskId, isDone} = action.payload
      return {
        ...state,
        [todoId]: state[todoId].map(t => t.id === taskId ? {...t, isDone: isDone} : t)
      }
    }

    case "ADD-NEW-TASK": {
      const {todoId, title} = action.payload
      const newTask: TaskPropsType = {
        id: v1(),
        title: title,
        isDone: false,
      }

      return {...state, [todoId]: [newTask, ...state[todoId]]};
    }

    case "CHANGE-TASK-TITLE": {
      const {todoId, taskId, title} = action.payload
      return {
        ...state,
        [todoId]: state[todoId].map(t => t.id === taskId ? {...t, title} : t)
      }
    }

    case "ADD-NEW-TODOLIST": {
      const {todoId} = action.payload
      return {...state, [todoId]: []};
    }

    case 'REMOVE-TODOLIST': {
      const {todoId} = action.payload
      const stateCopy = {...state}
      delete stateCopy[todoId];
      return stateCopy;
    }

    case "REMOVE-ALL-TODOLISTS": {
      return {};
    }

    default: {
      return state;
    }
  }
}