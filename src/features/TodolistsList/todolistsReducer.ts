import {todolistAPI, TodoListTypeDomain} from "../../api/todolists-api";
import {Dispatch} from "redux";
import {AppRootStateType, AppThunkDispatch} from "../../app/store";
import {RequestStatusType, setAppStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {fetchTasksTC} from "./tasksReducer";

export const SET_TODOLISTS = 'SET_TODOLISTS'
export const REMOVE_TODOLIST = 'REMOVE_TODOLIST'
export const REMOVE_ALL_TODOLISTS = 'REMOVE_ALL_TODOLISTS'
export const CREATE_TODOLIST = 'CREATE_TODOLIST'
export const CLEAR_TODOS_DATA = 'CLEAR_TODOS_DATA'
const CHANGE_FILTER = 'CHANGE_FILTER'
const CHANGE_TITLE = 'CHANGE_TITLE'
const CHANGE_TODOLIST_ENTITY_STATUS = 'CHANGE_TODOLIST_ENTITY_STATUS'


const initialState: TodolistType[] = []

export const todolistsReducer = (state: TodolistType[] = initialState, action: ActionType): TodolistType[] => {
  switch (action.type) {
    case SET_TODOLISTS: {
      const {todolists} = action.payload;
      return todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
    }

    case REMOVE_TODOLIST: {
      const {todoId} = action.payload
      return state.filter(tl => tl.id !== todoId);
    }

    case REMOVE_ALL_TODOLISTS: {
      return [];
    }

    case CHANGE_FILTER: {
      const {todoId, filter} = action.payload
      return state.map(tl => tl.id === todoId ? {...tl, filter} : tl);
    }

    case CREATE_TODOLIST: {
      const {todo} = action.payload
      return [{...todo, filter: 'all', entityStatus: 'idle'}, ...state];
    }

    case CHANGE_TITLE: {
      const {todoId, title} = action.payload
      return state.map(tl => tl.id === todoId ? {...tl, title} : tl);
    }

    case CHANGE_TODOLIST_ENTITY_STATUS: {
      const {id, status} = action.payload
      return state.map(tl => tl.id === id ? {...tl, entityStatus: status} : tl);
    }

    case CLEAR_TODOS_DATA: {
      return []
    }
    default:
      return state;
  }
}

export type TodolistType = TodoListTypeDomain & { filter: FilterValueType, entityStatus: RequestStatusType }

export type FilterValueType = 'all' | 'active' | 'completed';


type ActionType =
  | SetTodolistsActionType
  | RemoveTodolistActionType
  | RemoveAllTodoListsActionType
  | ChangeFilterActionType
  | AddNewTodolistActionType
  | ChangeTitleActionType
  | ChangeTodolistEntityStatusActionType
  | ClearTodosDataActionType

export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type RemoveAllTodoListsActionType = ReturnType<typeof removeAllTodoListsAC>
export type ChangeFilterActionType = ReturnType<typeof changeFilterAC>
export type ChangeTitleActionType = ReturnType<typeof changeTitleAC>
export type AddNewTodolistActionType = ReturnType<typeof createTodolistAC>
export type ChangeTodolistEntityStatusActionType = ReturnType<typeof changeTodolistEntityStatusAC>
export type ClearTodosDataActionType = ReturnType<typeof clearTodosDataAC>

// action creators
export const setTodolistsAC = (todolists: TodoListTypeDomain[]) => ({
  type: SET_TODOLISTS,
  payload: {todolists}
}) as const
export const removeTodolistAC = (todoId: string) => ({type: REMOVE_TODOLIST, payload: {todoId}}) as const
export const removeAllTodoListsAC = () => ({type: REMOVE_ALL_TODOLISTS, payload: {}}) as const
export const changeFilterAC = (todoId: string, filter: FilterValueType) => ({
  type: CHANGE_FILTER,
  payload: {
    todoId,
    filter
  }
}) as const
export const changeTitleAC = (todoId: string, title: string) => ({
  type: CHANGE_TITLE,
  payload: {
    todoId,
    title
  }
}) as const
export const createTodolistAC = (todo: TodoListTypeDomain) => ({
  type: CREATE_TODOLIST,
  payload: {todo}
}) as const
export const changeTodolistEntityStatusAC = (id: string, status: RequestStatusType) =>
  ({
    type: CHANGE_TODOLIST_ENTITY_STATUS,
    payload: {
      id,
      status,
    }
  }) as const
export const clearTodosDataAC = () => ({
  type: CLEAR_TODOS_DATA,
}) as const

// thunk creators
export const fetchTodolistsTC = () => {
  return (dispatch: AppThunkDispatch) => {
    dispatch(setAppStatusAC("loading"))
    todolistAPI.getTodolists()
      .then(data => {
        dispatch(setTodolistsAC(data))
        dispatch(setAppStatusAC("succeeded"))
        return data
      })
      .then(todos => todos.forEach(tl => dispatch(fetchTasksTC(tl.id))))
      .catch(err => handleServerNetworkError(err, dispatch))
  }
}
export const removeTodolistTC = (todoId: string) => {
  return (dispatch: Dispatch) => {
    dispatch(setAppStatusAC("loading"))
    dispatch(changeTodolistEntityStatusAC(todoId, "loading"))
    todolistAPI.removeTodolist(todoId)
      .then(data => {
        if (data.resultCode === 0) {
          dispatch(removeTodolistAC(todoId))
          dispatch(setAppStatusAC("succeeded"))
        } else {
          handleServerAppError(data, dispatch)
          dispatch(changeTodolistEntityStatusAC(todoId, "failed"))
        }
      })
      .catch(err => {
        handleServerNetworkError(err, dispatch)
      })
  }
}
export const removeAllTodolistsTC = () => {
  return (dispatch: Dispatch, getState: () => AppRootStateType) => {
    const todolists = getState().todolists
    dispatch(setAppStatusAC("loading"))
    todolists.forEach(tl => dispatch(changeTodolistEntityStatusAC(tl.id, "loading")))
    const promises = todolists.map(tl => todolistAPI.removeTodolist(tl.id))
    Promise.all(promises)
      .then(data => {
        console.log(data)
        if (data.every(d => d.resultCode === 0)) {
          dispatch(removeAllTodoListsAC())
          dispatch(setAppStatusAC("succeeded"))
        } else {
          data.forEach(d => {
            handleServerAppError(d, dispatch)
          })
          todolists.forEach(tl => dispatch(changeTodolistEntityStatusAC(tl.id, "failed")))
        }
      })
      .catch(err => {
        handleServerNetworkError(err, dispatch)
      })
  }
}
export const createTodolistTC = (title: string) => {
  return (dispatch: Dispatch) => {
    dispatch(setAppStatusAC("loading"))
    todolistAPI.createTodolist(title)
      .then(data => {
        if (data.resultCode === 0) {
          dispatch(createTodolistAC(data.data.item))
          dispatch(setAppStatusAC("succeeded"))
        } else {
          handleServerAppError(data, dispatch)
        }
      })
      .catch(err => {
        handleServerNetworkError(err, dispatch)
      })
  }
}
export const changeTitleTodolistTC = (todoId: string, title: string) => {
  return (dispatch: Dispatch) => {
    dispatch(setAppStatusAC("loading"))
    dispatch(changeTodolistEntityStatusAC(todoId, "loading"))
    todolistAPI.updateTodolist(todoId, title)
      .then(data => {
        if (data.resultCode === 0) {
          dispatch(changeTitleAC(todoId, title))
          dispatch(setAppStatusAC("succeeded"))
          dispatch(changeTodolistEntityStatusAC(todoId, "succeeded"))
        } else {
          handleServerAppError(data, dispatch)
          dispatch(changeTodolistEntityStatusAC(todoId, "failed"))
        }
      })
      .catch(err => {
        handleServerNetworkError(err, dispatch)
      })
  }
}