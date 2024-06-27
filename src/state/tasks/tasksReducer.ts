import {TasksStateType} from "../../App";
import {TaskPropsType} from "../../components/Todolist/Todolist";
import {v1} from "uuid";

type TasksReducerActionType =
  RemoveTaskActionType
  | ChangeTaskStatusActionType
  | AddNewTaskActionType
  | ChangeTaskTitleActionType

type RemoveTaskActionType = {
  type: 'REMOVE-TASK'
  todoId: string
  taskId: string
}

export const RemoveTaskAC = (todoId: string, taskId: string): RemoveTaskActionType => ({
  type: 'REMOVE-TASK',
  todoId,
  taskId
})

type ChangeTaskStatusActionType = {
  type: 'CHANGE-TASK-STATUS'
  todoId: string
  taskId: string
  isDone: boolean
}

export const ChangeTaskStatusAC = (todoId: string, taskId: string, isDone: boolean): ChangeTaskStatusActionType => ({
  type: 'CHANGE-TASK-STATUS',
  todoId,
  taskId,
  isDone
})

type AddNewTaskActionType = {
  type: 'ADD-NEW-TASK'
  todoId: string
  title: string
}

export const AddNewTaskAC = (todoId: string, title: string): AddNewTaskActionType => ({
  type: 'ADD-NEW-TASK',
  todoId,
  title
})

type ChangeTaskTitleActionType = {
  type: 'CHANGE-TASK-TITLE'
  todoId: string
  taskId: string
  title: string
}

export const ChangeTaskTitleAC = (todoId: string, taskId: string, title: string): ChangeTaskTitleActionType => ({
  type: 'CHANGE-TASK-TITLE',
  todoId,
  taskId,
  title
})


export const tasksReducer = (state: TasksStateType, action: TasksReducerActionType) => {
  switch (action.type) {

    case "REMOVE-TASK":
      return {...state, [action.todoId]: state[action.todoId].filter(t => t.id !== action.taskId)};

    case "CHANGE-TASK-STATUS":
      return {
        ...state,
        [action.todoId]: state[action.todoId].map(t => t.id === action.taskId ? {...t, isDone: action.isDone} : t)
      }

    case "ADD-NEW-TASK":
      const newTask: TaskPropsType = {
        id: v1(),
        title: action.title,
        isDone: false,
      }

      return {...state, [action.todoId]: [newTask, ...state[action.todoId]]};

    case "CHANGE-TASK-TITLE":
      return {...state, [action.todoId] : state[action.todoId].map(t => t.id === action.taskId ? {...t, title: action.title} : t)}

    default:
      throw new Error(`Unknown tasks action type: ${action}`);
  }
}