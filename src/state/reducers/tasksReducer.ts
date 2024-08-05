import {
  CREATE_TODOLIST,
  AddNewTodolistActionType, REMOVE_ALL_TODOLISTS, REMOVE_TODOLIST,
  RemoveAllTodoListsActionType,
  RemoveTodolistActionType, SET_TODOLISTS, SetTodolistsActionType
} from "./todolistsReducer";
import {TaskResponseType, todolistAPI} from "../../api/todolist-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "../store";

const SET_TASKS = 'SET_TASKS'
const REMOVE_TASK = 'REMOVE_TASK'
const CREATE_TASK = 'CREATE_TASK'
const UPDATE_TASK = 'UPDATE_TASK'

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: TasksReducerActionType): TasksStateType => {
  switch (action.type) {

    case SET_TODOLISTS: {
      const {todolists} = action.payload;
      const stateCopy = {...state}
      todolists.forEach(tl => {
        stateCopy[tl.id] = []
      })
      return stateCopy
    }

    case SET_TASKS: {
      const {todoId, tasks} = action.payload;
      return {...state, [todoId]: tasks.map(t => ({...t, isDone: t.status === TaskStatuses.inProgress}))}
    }

    case REMOVE_TASK: {
      const {todoId, taskId} = action.payload
      return {
        ...state,
        [todoId]: state[todoId].filter(t => t.id !== taskId)
      };
    }

    case UPDATE_TASK: {
      const {todoId, taskId, task} = action.payload;
      return {
        ...state,
        [todoId]: state[todoId].map(t => t.id === taskId ? {
          ...task,
          isDone: task.status === TaskStatuses.inProgress
        } : t)
      }
    }

    case CREATE_TASK: {
      const {todoId, task} = action.payload
      return {...state, [todoId]: [{...task, isDone: task.status === TaskStatuses.inProgress}, ...state[todoId]]};
    }

    case CREATE_TODOLIST: {
      const {todo} = action.payload
      return {...state, [todo.id]: []};
    }

    case REMOVE_TODOLIST: {
      const {todoId} = action.payload
      const stateCopy = {...state}
      delete stateCopy[todoId];
      return stateCopy;
    }

    case REMOVE_ALL_TODOLISTS: {
      return {};
    }

    default: {
      return state;
    }
  }
}

export enum TaskStatuses {
  New = 0,
  inProgress = 1,
  Completed = 2,
  Draft = 3
}

export enum TaskPriorities {
  Low = 0,
  Middle = 1,
  Hi = 2,
  Urgently = 3,
  Later = 4
}

export type TasksStateType = {
  [key: string]: Array<TaskResponseType & { isDone: boolean }>
}
export type TaskPropsType = {
  id: string
  title: string
  isDone: boolean
}

type TasksReducerActionType =
  | SetTodolistsActionType
  | SetTasksActionType
  | RemoveTaskActionType
  | UpdateTaskActionType
  | AddNewTaskActionType
  | AddNewTodolistActionType
  | RemoveTodolistActionType
  | RemoveAllTodoListsActionType

export type SetTasksActionType = ReturnType<typeof setTasksAC>
export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
export type AddNewTaskActionType = ReturnType<typeof createTaskAC>
export type UpdateTaskActionType = ReturnType<typeof updateTaskAC>

// action creators
export const setTasksAC = (todoId: string, tasks: TaskResponseType[]) => ({
  type: SET_TASKS,
  payload: {
    todoId,
    tasks
  }
}) as const
export const removeTaskAC = (todoId: string, taskId: string) => ({
  type: REMOVE_TASK,
  payload: {
    todoId,
    taskId
  }
}) as const
export const createTaskAC = (todoId: string, task: TaskResponseType) => ({
  type: CREATE_TASK,
  payload: {
    todoId,
    task
  }
}) as const
export const updateTaskAC = (todoId: string, taskId: string, task: TaskResponseType) => ({
  type: UPDATE_TASK,
  payload: {
    todoId,
    taskId,
    task
  }
}) as const


// thunk creators
export const fetchTasksTC = (todoId: string) => {
  return (dispatch: Dispatch) => {
    todolistAPI.getTasks(todoId)
      .then(data => dispatch(setTasksAC(todoId, data)))
  }
}
export const removeTaskTC = (todoId: string, taskId: string) => {
  return (dispatch: Dispatch) => {
    todolistAPI.removeTask(todoId, taskId)
      .then(data => dispatch(removeTaskAC(todoId, taskId)))
  }
}
export const createTaskTC = (todoId: string, title: string) => {
  return (dispatch: Dispatch) => {
    todolistAPI.createTask(todoId, title)
      .then(data => dispatch(createTaskAC(todoId, data.item)))
  }
}
export const updateTaskTC = (todoId: string, taskId: string, title: string, isDone: boolean) => {
  return (dispatch: Dispatch, getState: () => AppRootStateType) => {
    const tasks = getState().tasks;
    const task = tasks[todoId].find(t => t.id === taskId)
    if (task) {
      todolistAPI.updateTask(todoId, taskId, {
        ...task,
        title,
        status: isDone ? TaskStatuses.inProgress : TaskStatuses.New
      })
        .then(data => dispatch(updateTaskAC(todoId, taskId, data.item)))
    }
  }
}