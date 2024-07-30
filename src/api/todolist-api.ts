import axios from 'axios'

export const instance = axios.create({
  baseURL: 'https://social-network.samuraijs.com/api/1.1/',
  withCredentials: true,
  headers: {
    'API-KEY': '16d92d29-90e1-4a50-9895-c280bbd59c3f',
  },
})

type TodoListType = {
  addedDate: string
  id: string
  order: number
  title: string
}

type TodolistGeneric = {
  item: TodoListType
}

type FieldErrorType = {
  error: string
  field: string
}

export type ResponseType<D = {}> = {
  data: D
  fieldsErrors: FieldErrorType[]
  messages: string[]
  resultCode: number
}

export const todolistAPI = {
  getTodolists() {
    return instance.get<TodoListType[]>(`todo-lists/`)
  },
  deleteTodolist(todolistId: string) {
    return instance.delete<ResponseType>(`todo-lists/${todolistId}`)
  },
  createTodolist(title: string) {
    return instance.post<ResponseType<TodolistGeneric>>(`todo-lists/`,{ title })
  },
  updateTodolist(todolistId: string, title: string) {
    return instance.put<ResponseType>(`todo-lists/${todolistId}`,{ title })
  },
}