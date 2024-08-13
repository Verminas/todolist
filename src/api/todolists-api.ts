import axios from 'axios'

export const instance = axios.create({
  baseURL: 'https://social-network.samuraijs.com/api/1.1/',
  withCredentials: true,
  headers: {
    'API-KEY': '5a547771-3d12-4a7c-855e-ac319aa3d862',
  },
})



export const todolistAPI = {
  getTodolists() {
    return instance.get<TodoListTypeDomain[]>(`todo-lists/`)
      .then(data => data.data)
  },
  removeTodolist(todolistId: string) {
    return instance.delete<ResponseType>(`todo-lists/${todolistId}`)
      .then(data => data.data)
  },
  createTodolist(title: string) {
    return instance.post<ResponseType<TodolistGeneric>>(`todo-lists/`,{ title })
      .then(data => data.data)
  },
  updateTodolist(todolistId: string, title: string) {
    return instance.put<ResponseType>(`todo-lists/${todolistId}`,{ title })
      .then(data => data.data)
  },
  getTasks(todoID: string) {
    return instance.get<GetTasksResponseType>(`todo-lists/${todoID}/tasks`)
      .then(data => data.data)
  },

  createTask(todoID: string, title: string) {
    return instance.post<ResponseType<TaskGeneric>>(`todo-lists/${todoID}/tasks`, { title })
      .then(data => data.data)
  },

  updateTask(todoID: string, taskID: string, task: TaskResponseType) {
    return instance.put<ResponseType<TaskGeneric>>(`todo-lists/${todoID}/tasks/${taskID}`, task)
      .then(data => data.data)
  },

  removeTask(todoID: string, taskID: string) {
    return instance.delete<ResponseType>(`todo-lists/${todoID}/tasks/${taskID}`)
      .then(data => data.data)
  },
}

export type TodoListTypeDomain = {
  addedDate: string
  id: string
  order: number
  title: string
}

type TodolistGeneric = {
  item: TodoListTypeDomain
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

type GetTasksResponseType = {
  error: null | string
  items: TaskResponseType[]
  totalCount: number
}

type TaskGeneric = {
  item: TaskResponseType
}

type TaskRequestType = Omit<TaskResponseType, 'id' | 'todoListId' | 'order' | 'addedDate'>;

export type TaskResponseType = {
  description: string | null
  title: string
  completed: boolean
  status: number
  priority: number
  startDate: string | null
  deadline: string | null

  id: string
  todoListId: string
  order: number
  addedDate: string
}

export const getTaskRequestProperties = (task: TaskResponseType, title: string, isDone: boolean): TaskRequestType => ({
  description: task.description,
  title,
  completed: isDone,
  status: task.status,
  priority: task.priority,
  startDate: task.startDate,
  deadline: task.deadline,
})