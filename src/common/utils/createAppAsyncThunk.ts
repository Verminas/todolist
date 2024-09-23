import { AppRootStateType, AppDispatch } from "app/store";
import { createAsyncThunk } from "@reduxjs/toolkit";

/**
 * Async thunk creator function for creating asynchronous Redux logic.
 *
 * @template AppRootStateType - The type of the root state of the Redux store.
 * @template AppDispatch - The type of the dispatch function in the Redux store.
 * @template null | string - The possible types for the value that can be rejected by the async thunk.
 *
 * @returns {AsyncThunk<unknown, void, { state: AppRootStateType, dispatch: AppDispatch, rejectValue: null | string }>}
 */

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppRootStateType;
  dispatch: AppDispatch;
  rejectValue: null | string;
}>();
