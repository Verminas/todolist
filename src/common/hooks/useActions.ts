import { useMemo } from "react";
import { bindActionCreators } from "redux";
import { useAppDispatch } from "common/hooks";
import { tasksActions } from "features/TodolistsList/model/tasks/tasksSlice";
import { todolistsActions } from "features/TodolistsList/model/todolists/todolistsSlice";
import { authActions } from "features/auth/model/authSlice";
import { appActions } from "app/appSlice";

// ❗ упаковываем actions и соответсвенно при вызове хука не нужно
// будет передавать actions
const actionsAll = { ...tasksActions, ...todolistsActions, ...authActions, ...appActions };

type AllActions = typeof actionsAll;
type AllActionsBindDispatch = RemapActionCreators<AllActions>;

export const useActions = () => {
  const dispatch = useAppDispatch();

  return useMemo(() => bindActionCreators<AllActions, AllActionsBindDispatch>(actionsAll, dispatch), [dispatch]);
};

// Types
type RemapActionCreators<T extends Record<string, any>> = {
  [K in keyof T]: (...args: Parameters<T[K]>) => ReturnType<ReturnType<T[K]>>;
};

// https://medium.com/@lopatsin1990/typescript-%D0%BA%D0%BB%D1%8E%D1%87%D0%B5%D0%B2%D1%8B%D0%B5-%D1%81%D0%BB%D0%BE%D0%B2%D0%B0-keyof-%D0%B8-in-key-in-586ebe8e6460
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html#keyof-and-lookup-types
