import { asyncThunkCreator, buildCreateSlice, PayloadAction } from "@reduxjs/toolkit";

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
      setAppStatus: creators.reducer((state, action: PayloadAction<{ status: RequestStatusType }>) => {
        state.status = action.payload.status;
      }),
      setAppError: creators.reducer((state, action: PayloadAction<{ error: string | null }>) => {
        state.error = action.payload.error;
      }),
      setAppInitialized: creators.reducer((state, action: PayloadAction<{ isInitialized: boolean }>) => {
        state.isInitialized = action.payload.isInitialized;
      }),
    };
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
