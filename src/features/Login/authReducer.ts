import { Dispatch } from "redux";
import { setAppInitialized, setAppStatus } from "app/appReducer";
import { authAPI, LoginParamsType } from "api/todolistsApi";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearTodosData } from "features/TodolistsList/todolistsReducer";

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedIn(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
      state.isLoggedIn = action.payload.isLoggedIn;
    },
  },
});

export const authReducer = slice.reducer;
export const authActions = slice.actions;
export const { setIsLoggedIn } = slice.actions;

// thunks
export const loginTC = (data: LoginParamsType) => (dispatch: Dispatch) => {
  dispatch(setAppStatus({ status: "loading" }));
  return authAPI
    .login(data)
    .then((data) => {
      if (data.resultCode === 0) {
        dispatch(setIsLoggedIn({ isLoggedIn: true }));
        dispatch(setAppStatus({ status: "succeeded" }));
      } else {
        handleServerAppError(data, dispatch);
      }

      return data;
    })
    .catch((err) => {
      handleServerNetworkError(err, dispatch);
    });
};

export const initializeAppTC = () => (dispatch: Dispatch) => {
  authAPI
    .me()
    .then((data) => {
      // debugger
      if (data.resultCode === 0) {
        dispatch(setIsLoggedIn({ isLoggedIn: true }));
      } else {
        handleServerAppError(data, dispatch);
      }

      dispatch(setAppInitialized({ isInitialized: true }));
    })
    .catch((err) => {
      handleServerNetworkError(err, dispatch);
    });
};

export const logoutTC = () => (dispatch: Dispatch) => {
  dispatch(setAppStatus({ status: "loading" }));
  authAPI
    .logout()
    .then((data) => {
      if (data.resultCode === 0) {
        dispatch(setIsLoggedIn({ isLoggedIn: false }));
        dispatch(setAppStatus({ status: "succeeded" }));
        dispatch(clearTodosData());
      } else {
        handleServerAppError(data, dispatch);
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch);
    });
};

export type AuthReducerInitialType = ReturnType<typeof slice.getInitialState>;
