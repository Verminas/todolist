import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

const slice = createSlice({
  name: "app",
  initialState: {
    status: "idle" as RequestStatusType,
    error: null as string | null,
    isInitialized: false,
  },
  reducers: {
    setAppStatus(state, action: PayloadAction<{ status: RequestStatusType }>) {
      state.status = action.payload.status;
    },
    setAppError(state, action: PayloadAction<{ error: string | null }>) {
      state.error = action.payload.error;
    },
    setAppInitialized(state, action: PayloadAction<{ isInitialized: boolean }>) {
      state.isInitialized = action.payload.isInitialized;
    },
  },
});

export const appReducer = slice.reducer;
export const appActions = slice.actions;
export const { setAppInitialized, setAppError, setAppStatus } = slice.actions;
export type AppInitialStateType = ReturnType<typeof slice.getInitialState>;
