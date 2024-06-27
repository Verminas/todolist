import {TasksStateType, TodolistType} from "../../App";
import {FilterValueType} from "../../components/Todolist/Todolist";
import {v1} from "uuid";

type ActionType =
  RemoveTodolistActionType
  | RemoveAllTodoListsActionType
  | ChangeFilterActionType
  | AddNewTodolistActionType
  | ChangeTitleActionType

export type RemoveTodolistActionType = {
  type: 'REMOVE-TODOLIST'
  todoId: string
}

export const RemoveTodolistAC = (todoId: string): RemoveTodolistActionType => ({type: 'REMOVE-TODOLIST', todoId})

export type RemoveAllTodoListsActionType = {
  type: 'REMOVE-ALL-TODOLISTS'
}

export const RemoveAllTodoListsAC = (): RemoveAllTodoListsActionType => ({type: 'REMOVE-ALL-TODOLISTS'})

export type ChangeFilterActionType = {
  type: 'CHANGE-FILTER'
  todoId: string
  filter: FilterValueType
}

export const ChangeFilterAC = (todoId: string, filter: FilterValueType): ChangeFilterActionType => ({
  type: 'CHANGE-FILTER',
  todoId,
  filter
})

export type ChangeTitleActionType = {
  type: 'CHANGE-TITLE'
  todoId: string
  title: string
}

export const ChangeTitleAC = (todoId: string, title: string): ChangeTitleActionType => ({
  type: 'CHANGE-TITLE',
  todoId,
  title
})

export type AddNewTodolistActionType = {
  type: 'ADD-NEW-TODOLIST'
  title: string
}

export const AddNewTodolistAC = (title: string): AddNewTodolistActionType => ({type: 'ADD-NEW-TODOLIST', title})


export const todolistsReducer = (state: TodolistType[], action: ActionType): TodolistType[] => {
  switch (action.type) {
    case 'REMOVE-TODOLIST':
      return state.filter(tl => tl.id !== action.todoId);

    case "REMOVE-ALL-TODOLISTS":
      state.length = 0;
      return [];

    case "CHANGE-FILTER":
      return state.map(tl => tl.id === action.todoId ? {...tl, filter: action.filter} : tl);

    case "ADD-NEW-TODOLIST": // need to fix with reducer for tasks
      const newTodolist: TodolistType = {
        id: v1(),
        title: action.title,
        filter: 'all',
      }
      return [newTodolist, ...state];

    case "CHANGE-TITLE":
      return state.map(tl => tl.id === action.todoId ? {...tl, title: action.title} : tl);

    default:
      throw new Error(`Unknown todolist action type: ${action}`);
  }
}