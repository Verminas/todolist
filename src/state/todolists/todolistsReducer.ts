import {TodolistType} from "../../App";
import {FilterValueType} from "../../components/Todolist/Todolist";

type ActionType =
  RemoveTodolistActionType
  | RemoveAllTodoListsActionType
  | ChangeFilterActionType
  | AddNewTodolistActionType
  | ChangeTitleActionType

export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type RemoveAllTodoListsActionType = ReturnType<typeof removeAllTodoListsAC>
export type ChangeFilterActionType = ReturnType<typeof changeFilterAC>
export type ChangeTitleActionType = ReturnType<typeof changeTitleAC>
export type AddNewTodolistActionType = ReturnType<typeof addNewTodolistAC>

export const removeTodolistAC = (todoId: string) => ({type: 'REMOVE-TODOLIST', payload: {todoId} }) as const

export const removeAllTodoListsAC = () => ({type: 'REMOVE-ALL-TODOLISTS', payload: {}}) as const

export const changeFilterAC = (todoId: string, filter: FilterValueType) => ({
  type: 'CHANGE-FILTER',
  payload: {
    todoId,
    filter
  }
}) as const

export const changeTitleAC = (todoId: string, title: string) => ({
  type: 'CHANGE-TITLE',
  payload: {
    todoId,
    title
  }
}) as const

export const addNewTodolistAC = (title: string, todoId: string) => ({type: 'ADD-NEW-TODOLIST', payload: {title, todoId}}) as const

const initialState: TodolistType[] = []

export const todolistsReducer = (state: TodolistType[] = initialState, action: ActionType): TodolistType[] => {
  switch (action.type) {
    case 'REMOVE-TODOLIST': {
      const {todoId} = action.payload
      return state.filter(tl => tl.id !== todoId);
    }

    case "REMOVE-ALL-TODOLISTS": {
      return [];
    }

    case "CHANGE-FILTER": {
      const {todoId, filter} = action.payload
      return state.map(tl => tl.id === todoId ? {...tl, filter} : tl);
    }

    case "ADD-NEW-TODOLIST": {
      const {todoId, title} = action.payload
      const newTodolist: TodolistType = {
        id: todoId,
        title,
        filter: 'all',
      }
      return [newTodolist, ...state];
    }

    case "CHANGE-TITLE": {
      const {todoId, title} = action.payload
      return state.map(tl => tl.id === todoId ? {...tl, title} : tl);
    }

    default: {
      return state;
    }
  }
}