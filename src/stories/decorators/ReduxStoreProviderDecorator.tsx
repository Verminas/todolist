import React from "react";
import { Provider } from "react-redux";
import { combineReducers } from "redux";
import { tasksReducer } from "features/TodolistsList/tasksSlice";
import { todolistsSlice } from "features/TodolistsList/todolistsSlice";
import { v1 } from "uuid";
import { appReducer } from "app/appSlice";
import { authReducer } from "features/Login/authSlice";
import { configureStore } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsSlice,
  app: appReducer,
  auth: authReducer,
});

const initialGlobalState: StoryBookStoreInitialState = {
  todolists: [
    { id: "todolistId1", title: "What to learn", filter: "all", addedDate: "", entityStatus: "idle", order: 0 },
    { id: "todolistId2", title: "What to buy", filter: "all", addedDate: "", entityStatus: "idle", order: 0 },
  ],
  tasks: {
    ["todolistId1"]: [
      {
        id: v1(),
        title: "HTML&CSS",
        isDone: true,
        order: 0,
        entityStatus: "idle",
        completed: false,
        status: 0,
        addedDate: "",
        deadline: "",
        description: "",
        priority: 0,
        startDate: "",
        todoListId: "todolistId1",
      },
      {
        id: v1(),
        title: "JS",
        isDone: false,
        order: 0,
        entityStatus: "idle",
        completed: false,
        status: 0,
        addedDate: "",
        deadline: "",
        description: "",
        priority: 0,
        startDate: "",
        todoListId: "todolistId1",
      },
    ],
    ["todolistId2"]: [
      {
        id: v1(),
        title: "Milk",
        isDone: false,
        order: 0,
        entityStatus: "idle",
        completed: false,
        status: 0,
        addedDate: "",
        deadline: "",
        description: "",
        priority: 0,
        startDate: "",
        todoListId: "todolistId2",
      },
      {
        id: v1(),
        title: "React Book",
        isDone: true,
        order: 0,
        entityStatus: "idle",
        completed: false,
        status: 0,
        addedDate: "",
        deadline: "",
        description: "",
        priority: 0,
        startDate: "",
        todoListId: "todolistId2",
      },
    ],
  },
  app: {
    status: "idle",
    error: null,
    isInitialized: true,
  },
  auth: {
    isLoggedIn: true,
  },
};

// export const storyBookStore = legacy_createStore(rootReducer, initialGlobalState as any);

export const storyBookStore = configureStore({
  reducer: rootReducer,
});

type StoryBookStoreInitialState = ReturnType<typeof storyBookStore.getState>;

export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
  return <Provider store={storyBookStore}>{storyFn()}</Provider>;
};
