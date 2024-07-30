import {instance, ResponseType} from "./todolist-api";


type TaskResponseType = {
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

type TaskGeneric = {
  item: TaskResponseType
}

type TaskRequestType = Omit<TaskResponseType, 'id' | 'todoListId' | 'order' | 'addedDate'>;

type GetTasksResponseType = {
  error: null | string
  items: TaskResponseType[]
  totalCount: number
}

const getTaskRequestProperties = (title: string): TaskRequestType => ({
  description: null,
  title,
  completed: false,
  status: 0,
  priority: 1,
  startDate: null,
  deadline: null
})

export const taskAPI = {
  getTasks(todoID: string) {
    return instance.get<GetTasksResponseType>(`todo-lists/${todoID}/tasks`)
  },

  createTask(todoID: string, title: string) {
    return instance.post<ResponseType<TaskGeneric>>(`todo-lists/${todoID}/tasks`, { title })
  },

  updateTask(todoID: string, taskID: string,title: string) {
    const taskRequestProperties: TaskRequestType = getTaskRequestProperties(title)
    return instance.put<ResponseType<TaskGeneric>>(`todo-lists/${todoID}/tasks/${taskID}`, taskRequestProperties)
  },

  deleteTask(todoID: string, taskID: string) {
    return instance.delete<ResponseType>(`todo-lists/${todoID}/tasks/${taskID}`)
  },
}