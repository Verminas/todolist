import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";
import { ResultCode } from "common/enums";
import { AppDispatch } from "app/store";
import { todolistsActions } from "features/TodolistsList/todolistsSlice";
import { authAPI, LoginParamsType } from "../api/authApi";
import { BaseResponse } from "common/types";
import { handleServerAppError, thunkTryCatch, handleServerNetworkError } from "common/utils";
import { appActions } from "app/appSlice";

const createAppSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

const slice = createAppSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: (creators) => {
    const createAThunk = creators.asyncThunk.withTypes<{ rejectValue: null | BaseResponse }>();

    return {
      login: createAThunk<AuthReducerInitialType, LoginParamsType>(
        (data, thunkAPI) => {
          const { dispatch, rejectWithValue } = thunkAPI;

          return thunkTryCatch(thunkAPI, async () => {
            const res = await authAPI.login(data);
            if (res.resultCode === ResultCode.Success) {
              return { isLoggedIn: true };
            } else {
              handleServerAppError(res, dispatch, false);
              return rejectWithValue(res);
            }
          });
        },
        {
          fulfilled: (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn;
          },
        },
      ),
      logout: createAThunk<AuthReducerInitialType>(
        (_, thunkAPI) => {
          const { dispatch, rejectWithValue } = thunkAPI;

          return thunkTryCatch(thunkAPI, async () => {
            const res = await authAPI.logout();
            if (res.resultCode === ResultCode.Success) {
              dispatch(todolistsActions.clearTodosData());
              return { isLoggedIn: false };
            } else {
              handleServerAppError(res, dispatch);
              return rejectWithValue(null);
            }
          });
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
              return { isLoggedIn: true };
            } else {
              // TODO
              // закомментили для дальнейшей обработки ошибки при первом входе
              // handleServerAppError(res, dispatch);
              return rejectWithValue(null);
            }
          } catch (err) {
            handleServerNetworkError(err, dispatch as AppDispatch);
            return rejectWithValue(null);
          } finally {
            dispatch(appActions.setAppInitialized({ isInitialized: true }));
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
