export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
  status: 'idle' as RequestStatusType,
  error: null,
  isInitialized: false,
}

const APP_SET_STATUS = 'APP/SET-STATUS'
const APP_SET_ERROR = 'APP/SET-ERROR'
const APP_SET_INITIALIZATION = 'APP/APP_SET_INITIALIZATION'

export type InitialStateType = {
  status: RequestStatusType
  error: string | null
  isInitialized: boolean
}

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
  switch (action.type) {
    case APP_SET_STATUS:
      const { status } = action.payload
      return {...state, status }
    case APP_SET_ERROR: {
      const { error } = action.payload
      return {...state, error}
    }
    case APP_SET_INITIALIZATION: {
      const { isInitialized } = action.payload
      return {...state, isInitialized}
    }
    default:
      return state
  }
}

export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type SetAppIsInitializedActionTypeC = ReturnType<typeof setAppInitializedAC>

type ActionsType = SetAppStatusActionType | SetAppErrorActionType | SetAppIsInitializedActionTypeC



export const setAppStatusAC = (status: RequestStatusType) => ({
  type: APP_SET_STATUS,
  payload: {
    status
  }
}) as const

export const setAppErrorAC = (error: string | null) => ({
  type: APP_SET_ERROR,
  payload: {
    error
  }
}) as const

export const setAppInitializedAC = (isInitialized: boolean) => ({
  type: APP_SET_INITIALIZATION,
  payload: {
    isInitialized
  }
}) as const