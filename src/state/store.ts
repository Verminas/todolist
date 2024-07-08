import { tasksReducer } from './tasks/tasksReducer'
import { todolistsReducer } from './todolists/todolistsReducer'
import { combineReducers, createStore } from 'redux'

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer
})

export const store = createStore(rootReducer)

export type AppRootStateType = ReturnType<typeof rootReducer>

// @ts-ignore
window.store = store
