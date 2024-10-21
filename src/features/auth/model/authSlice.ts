import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";
import { ResultCode } from "common/enums";
import { todolistsActions } from "features/TodolistsList/model/todolistsSlice";
import { authAPI, LoginParamsType } from "../api/authApi";
import { BaseResponse } from "common/types";

const createAppSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

const slice = createAppSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: (creators) => {
    const createAThunk = creators.asyncThunk.withTypes<{ rejectValue: null | BaseResponse | unknown }>();

    return {
      login: createAThunk<AuthReducerInitialType, LoginParamsType>(
        async (data, thunkAPI) => {
          const { rejectWithValue } = thunkAPI;

          const res = await authAPI.login(data);
          if (res.resultCode === ResultCode.Success) {
            return { isLoggedIn: true };
          } else {
            return rejectWithValue(res);
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

          const res = await authAPI.logout();
          if (res.resultCode === ResultCode.Success) {
            dispatch(todolistsActions.clearTodosData());
            return { isLoggedIn: false };
          } else {
            return rejectWithValue(res);
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
          const { rejectWithValue } = thunkAPI;

          const res = await authAPI.me();
          if (res.resultCode === ResultCode.Success) {
            return { isLoggedIn: true };
          } else {
            return rejectWithValue(res);
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
export const authActions = slice.actions;
export const { selectIsLoggedIn } = slice.selectors;

export type AuthReducerInitialType = { isLoggedIn: boolean };
