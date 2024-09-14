import { setAppInitialized, setAppStatus } from "app/appSlice";
import { authAPI, LoginParamsType } from "api/todolistsApi";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { createSlice } from "@reduxjs/toolkit";
import { clearTodosData } from "features/TodolistsList/todolistsSlice";
import { createAppAsyncThunk } from "utils/create-app-async-thunk";
import { ResultCode } from "enums";

export const login = createAppAsyncThunk<AuthReducerInitialType, LoginParamsType>(
  "auth/login",
  async (data, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(setAppStatus({ status: "loading" }));
      const res = await authAPI.login(data);
      if (res.resultCode === ResultCode.Success) {
        dispatch(setAppStatus({ status: "succeeded" }));
        return { isLoggedIn: true };
      } else {
        handleServerAppError(res, dispatch);
        const err = res.messages[0] || null;
        return rejectWithValue(err);
      }
    } catch (err) {
      handleServerNetworkError(err, dispatch);
      return rejectWithValue(null);
    }
  },
);

export const logout = createAppAsyncThunk<AuthReducerInitialType>("auth/logout", async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(setAppStatus({ status: "loading" }));
    const res = await authAPI.logout();
    if (res.resultCode === ResultCode.Success) {
      dispatch(setAppStatus({ status: "succeeded" }));
      dispatch(clearTodosData());
      return { isLoggedIn: false };
    } else {
      handleServerAppError(res, dispatch);
      return rejectWithValue(null);
    }
  } catch (error) {
    handleServerNetworkError(error, dispatch);
    return rejectWithValue(null);
  }
});

export const initializeApp = createAppAsyncThunk<AuthReducerInitialType>("auth/initializeApp", async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    const res = await authAPI.me();
    if (res.resultCode === ResultCode.Success) {
      dispatch(setAppInitialized({ isInitialized: true }));
      return { isLoggedIn: true };
    } else {
      dispatch(setAppInitialized({ isInitialized: true }));
      handleServerAppError(res, dispatch);
      return rejectWithValue(null);
    }
  } catch (err) {
    handleServerNetworkError(err, dispatch);
    return rejectWithValue(null);
  }
});

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
        ///
      })
      .addCase(initializeApp.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      });
  },
  selectors: {
    selectIsLoggedIn: (sliceState) => sliceState.isLoggedIn,
  },
});

export const authReducer = slice.reducer;
export const authThunks = { login, logout, initializeApp };
export const { selectIsLoggedIn } = slice.selectors;

export type AuthReducerInitialType = ReturnType<typeof slice.getInitialState>;
