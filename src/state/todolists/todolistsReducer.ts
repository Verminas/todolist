import {TasksStateType, TodolistType} from "../../App";
import {FilterValueType} from "../../components/Todolist/Todolist";
import {v1} from "uuid";
import {useState} from "react";

type ActionType =
  RemoveTodolistActionType
  | RemoveAllTodoListsActionType
  | ChangeFilterActionType
  | AddNewTodolistActionType
  | ChangeTitleActionType

export type RemoveTodolistActionType = {
  type: 'REMOVE-TODOLIST'
  payload: {
    todoId: string
  }
}

export const removeTodolistAC = (todoId: string): RemoveTodolistActionType => ({type: 'REMOVE-TODOLIST', payload: {todoId} })

export type RemoveAllTodoListsActionType = {
  type: 'REMOVE-ALL-TODOLISTS'
  payload: {}
}

export const removeAllTodoListsAC = (): RemoveAllTodoListsActionType => ({type: 'REMOVE-ALL-TODOLISTS', payload: {}})

export type ChangeFilterActionType = {
  type: 'CHANGE-FILTER'
  payload: {
    todoId: string
    filter: FilterValueType
  }
}

export const changeFilterAC = (todoId: string, filter: FilterValueType): ChangeFilterActionType => ({
  type: 'CHANGE-FILTER',
  payload: {
    todoId,
    filter
  }
})

export type ChangeTitleActionType = {
  type: 'CHANGE-TITLE'
  payload: {
    todoId: string
    title: string
  }
}

export const changeTitleAC = (todoId: string, title: string): ChangeTitleActionType => ({
  type: 'CHANGE-TITLE',
  payload: {
    todoId,
    title
  }
})

export type AddNewTodolistActionType = {
  type: 'ADD-NEW-TODOLIST'
  payload: {
    todoId: string
    title: string
  }
}

export const addNewTodolistAC = (title: string, todoId: string): AddNewTodolistActionType => ({type: 'ADD-NEW-TODOLIST', payload: {title, todoId}})

export const todolistId1 = v1();
export const todolistId2 = v1();

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