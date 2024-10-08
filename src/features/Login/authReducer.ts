import {Dispatch} from 'redux'
import {
  SetAppErrorActionType, setAppInitializedAC,
  setAppStatusAC,
  SetAppStatusActionType,
} from '../../app/app-reducer'
import {authAPI, LoginParamsType} from "../../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {
  changeTodolistEntityStatusAC,
  clearTodosDataAC,
  ClearTodosDataActionType
} from "../TodolistsList/todolistsReducer";

const initialState = {
  isLoggedIn: false,
}
type InitialStateType = typeof initialState

export const authReducer = (
  state: InitialStateType = initialState,
  action: ActionsType
): InitialStateType => {
  switch (action.type) {
    case 'login/SET-IS-LOGGED-IN':
      return {...state, isLoggedIn: action.value}
    default:
      return state
  }
}
// actions
export const setIsLoggedInAC = (value: boolean) =>
  ({type: 'login/SET-IS-LOGGED-IN', value}) as const

// thunks
export const loginTC = (data: LoginParamsType) => (dispatch: Dispatch<ActionsType>) => {
  dispatch(setAppStatusAC('loading'))
  authAPI.login(data)
    .then(data => {
      if (data.resultCode === 0) {
        dispatch(setIsLoggedInAC(true))
        dispatch(setAppStatusAC('succeeded'))
      } else {
        handleServerAppError(data, dispatch)
      }
    })
    .catch(err => {
      handleServerNetworkError(err, dispatch)
    })
}

export const initializeAppTC = () => (dispatch: Dispatch) => {
  authAPI.me().then(data => {
    // debugger
    if (data.resultCode === 0) {
      dispatch(setIsLoggedInAC(true))
    } else {
      handleServerAppError(data, dispatch)
    }

    dispatch(setAppInitializedAC(true))
  })
    .catch(err => {
      handleServerNetworkError(err, dispatch)
    })
}


export const logoutTC = () => (dispatch: Dispatch<ActionsType>) => {
  dispatch(setAppStatusAC('loading'))
  authAPI
    .logout()
    .then(data => {
      if (data.resultCode === 0) {
        dispatch(setIsLoggedInAC(false))
        dispatch(setAppStatusAC('succeeded'))
        dispatch(clearTodosDataAC())
      } else {
        handleServerAppError(data, dispatch)
      }
    })
    .catch(error => {
      handleServerNetworkError(error, dispatch)
    })
}

// types
type ActionsType =
  | ReturnType<typeof setIsLoggedInAC>
  | SetAppStatusActionType
  | SetAppErrorActionType
  | ClearTodosDataActionType