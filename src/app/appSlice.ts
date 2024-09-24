import {
  AnyAction,
  asyncThunkCreator,
  buildCreateSlice,
  isAnyOf,
  isFulfilled,
  isPending,
  isRejected,
  PayloadAction,
} from "@reduxjs/toolkit";
import { todolistsActions } from "features/TodolistsList/model/todolists/todolistsSlice";
import { tasksActions } from "features/TodolistsList/model/tasks/tasksSlice";
import { authActions } from "features/auth/model/authSlice";

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

const createAppSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

const slice = createAppSlice({
  name: "app",
  initialState: {
    status: "idle" as RequestStatusType,
    error: null as string | null,
    isInitialized: false,
  },
  reducers: (creators) => {
    return {
      setAppError: creators.reducer((state, action: PayloadAction<{ error: string | null }>) => {
        state.error = action.payload.error;
      }),
      setAppInitialized: creators.reducer((state, action: PayloadAction<{ isInitialized: boolean }>) => {
        state.isInitialized = action.payload.isInitialized;
      }),
    };
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(isPending, (state, action) => {
        state.status = "loading";
      })
      .addMatcher(isFulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addMatcher(isRejected, (state, action: AnyAction) => {
        state.status = "failed";
        console.log(action);

        if (action.payload) {
          if (action.type === todolistsActions.createTodolist.rejected.type) return;
          if (action.type === tasksActions.createTask.rejected.type) return;
          if (action.type === authActions.initializeApp.rejected.type) return;
          if (action.type === authActions.login.rejected.type) return;

          state.error = action.payload.messages[0];
        } else {
          state.error = action.error.message ? action.error.message : "Some error occurred";
        }
      })
      .addMatcher(isAnyOf(authActions.initializeApp.settled), (state) => {
        state.isInitialized = true;
      });
  },
  selectors: {
    selectIsInitialized: (sliceState) => sliceState.isInitialized,
    selectError: (sliceState) => sliceState.error,
    selectStatus: (sliceState) => sliceState.status,
  },
});

export const appReducer = slice.reducer;
export const appActions = slice.actions;
export const { selectStatus, selectIsInitialized, selectError } = slice.selectors;
export type AppInitialStateType = ReturnType<typeof slice.getInitialState>;
