import { setAppInitialized, setAppStatus } from "app/appSlice";
import { authAPI, LoginParamsType } from "common/api/todolistsApi";
import { handleServerAppError, handleServerNetworkError } from "common/utils/error-utils";
import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";
import { ResultCode } from "common/enums";
import { AppThunkDispatch } from "app/store";
import { todolistsActions } from "features/TodolistsList/todolistsSlice";

const createAppSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

const slice = createAppSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: (creators) => {
    const createAThunk = creators.asyncThunk.withTypes<{ rejectValue: null | string }>();

    return {
      login: createAThunk<AuthReducerInitialType, LoginParamsType>(
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
            handleServerNetworkError(err, dispatch as AppThunkDispatch);
            return rejectWithValue(null);
          }
        },
        {
          fulfilled: (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn;
          },
        },
      ),
      logout: createAThunk<AuthReducerInitialType>(
        async (_, thunkAPI) => {
          const { dispatch, rejectWithValue } = thunkAPI;
          try {
            dispatch(setAppStatus({ status: "loading" }));
            const res = await authAPI.logout();
            if (res.resultCode === ResultCode.Success) {
              dispatch(setAppStatus({ status: "succeeded" }));
              dispatch(todolistsActions.clearTodosData());
              return { isLoggedIn: false };
            } else {
              handleServerAppError(res, dispatch);
              return rejectWithValue(null);
            }
          } catch (error) {
            handleServerNetworkError(error, dispatch as AppThunkDispatch);
            return rejectWithValue(null);
          }
        },
        {
          fulfilled: (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn;
          },
        },
      ),
      initializeApp: createAThunk<AuthReducerInitialType>(
        async (_, thunkAPI) => {
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
            handleServerNetworkError(err, dispatch as AppThunkDispatch);
            return rejectWithValue(null);
          }
        },
        {
          fulfilled: (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn;
          },
        },
      ),
    };
  },
  selectors: {
    selectIsLoggedIn: (sliceState) => sliceState.isLoggedIn,
  },
});

export const authReducer = slice.reducer;
export const { login, logout, initializeApp } = slice.actions;
export const { selectIsLoggedIn } = slice.selectors;

export type AuthReducerInitialType = { isLoggedIn: boolean };
