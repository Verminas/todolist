import {todolistAPI, TodoListTypeDomain} from "../../api/todolist-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "../store";

export const SET_TODOLISTS = 'SET_TODOLISTS'
export const REMOVE_TODOLIST = 'REMOVE_TODOLIST'
export const REMOVE_ALL_TODOLISTS = 'REMOVE_ALL_TODOLISTS'
export const CREATE_TODOLIST = 'CREATE_TODOLIST'
const CHANGE_FILTER = 'CHANGE_FILTER'
const CHANGE_TITLE = 'CHANGE_TITLE'

const initialState: TodolistType[] = []

export const todolistsReducer = (state: TodolistType[] = initialState, action: ActionType): TodolistType[] => {
  switch (action.type) {
    case SET_TODOLISTS: {
      const {todolists} = action.payload;
      return todolists.map(tl => ({...tl, filter: 'all'}))
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
      const { todo } = action.payload
      return [{...todo, filter: 'all'}, ...state];
    }

    case CHANGE_TITLE: {
      const {todoId, title} = action.payload
      return state.map(tl => tl.id === todoId ? {...tl, title} : tl);
    }

    default: return state;
  }
}

export type TodolistType = TodoListTypeDomain & {filter: FilterValueType }

export type FilterValueType = 'all' | 'active' | 'completed';


type ActionType =
  | SetTodolistsActionType
  | RemoveTodolistActionType
  | RemoveAllTodoListsActionType
  | ChangeFilterActionType
  | AddNewTodolistActionType
  | ChangeTitleActionType

export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type RemoveAllTodoListsActionType = ReturnType<typeof removeAllTodoListsAC>
export type ChangeFilterActionType = ReturnType<typeof changeFilterAC>
export type ChangeTitleActionType = ReturnType<typeof changeTitleAC>
export type AddNewTodolistActionType = ReturnType<typeof createTodolistAC>

// action creators
export const setTodolistsAC = (todolists: TodoListTypeDomain[] ) => ({
  type: SET_TODOLISTS,
  payload: { todolists }
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
  payload: { todo }
}) as const

// thunk creators
export const fetchTodolistsTC = () => {
  return (dispatch: Dispatch) => {
    todolistAPI.getTodolists()
      .then(data => dispatch(setTodolistsAC(data)))
  }
}
export const removeTodolistTC = (todoId: string) => {
  return (dispatch: Dispatch) => {
    todolistAPI.removeTodolist(todoId)
      .then(data => dispatch(removeTodolistAC(todoId)))
  }
}
export const removeAllTodolistsTC = () => {
  return (dispatch: Dispatch, getState: () => AppRootStateType) => {
    const todolists = getState().todolists
    const promises = todolists.map(tl => todolistAPI.removeTodolist(tl.id))
    Promise.all(promises)
      .then(data => dispatch(removeAllTodoListsAC()))
  }
}
export const createTodolistTC = (title: string) => {
  return (dispatch: Dispatch) => {
    todolistAPI.createTodolist(title)
      .then(data => dispatch(createTodolistAC(data.item)))
  }
}
export const changeTitleTodolistTC = (todoId: string, title: string) => {
  return (dispatch: Dispatch) => {
    todolistAPI.updateTodolist(todoId, title)
      .then(data => dispatch(changeTitleAC(todoId, title)))
  }
}