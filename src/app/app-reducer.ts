export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
  status: 'loading' as RequestStatusType,
  error: null
}

const APP_SET_STATUS = 'APP/SET-STATUS'
const APP_SET_ERROR = 'APP/SET-ERROR'

export type InitialStateType = {
  status: RequestStatusType
  error: string | null
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
    default:
      return state
  }
}

export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>

type ActionsType = SetAppStatusActionType | SetAppErrorActionType



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