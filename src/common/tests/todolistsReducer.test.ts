import { v1 } from "uuid";
import { todolistsActions, todolistsSlice, TodolistType } from "features/TodolistsList/todolistsSlice";

import { TodoListTypeDomain } from "common/types";

const todoId1 = v1();
const todoId2 = v1();
const todo1Title = "First todolist";
const todo2Title = "Second todolist";
let initialState: TodolistType[];

export function getTodolist(todoId: string, title: string): TodoListTypeDomain {
  return { id: todoId, title, addedDate: "", order: 0 };
}

beforeEach(() => {
  initialState = [
    {
      ...getTodolist(todoId1, todo1Title),
      filter: "all",
      entityStatus: "idle",
    },
    {
      ...getTodolist(todoId2, todo2Title),
      filter: "all",
      entityStatus: "idle",
    },
  ];
});

test("remove todolist should be correct", () => {
  const action = todolistsActions.removeTodolist.fulfilled({ todoId: todoId1 }, "requestId", todoId1);
  const endState = todolistsSlice(initialState, action);

  expect(endState.length).toBe(1);
  expect(endState[0].id).toBe(todoId2);
});

test("remove all todolists should be correct", () => {
  const action = todolistsActions.removeAllTodolists.fulfilled(undefined, "requestId", undefined);
  const endState = todolistsSlice(initialState, action);

  expect(endState.length).toBe(0);
  expect(endState[0]).toBeUndefined();
  expect(endState).toEqual([]);
});

test("change filter in todolist should be correct", () => {
  const action = todolistsActions.changeFilter({ todoId: todoId1, filter: "active" });
  const endState = todolistsSlice(initialState, action);

  expect(endState.length).toBe(2);
  expect(endState[0].filter).toBe("active");
  expect(endState[1].filter).toBe("all");
});

test("create new todolist should be correct", () => {
  const newTodo = getTodolist(v1(), "New Todo");
  const action = todolistsActions.createTodolist.fulfilled({ todolist: newTodo }, "requestId", newTodo.title);
  const endState = todolistsSlice(initialState, action);

  expect(endState.length).toBe(3);
  expect(endState[0].title).toBe(newTodo.title);
  expect(endState[1].id).toBe(todoId1);
});

test("change title in todolist should be correct", () => {
  const newTitle = "Changed Title";
  const dataModel = { todoId: todoId1, title: newTitle };
  const action = todolistsActions.changeTitleTodolist.fulfilled(dataModel, "requestId", dataModel);
  const endState = todolistsSlice(initialState, action);

  expect(endState.length).toBe(2);
  expect(endState[0].title).toBe(newTitle);
  expect(endState[1].title).toBe(todo2Title);
});

test("change todolist entity status should be correct", () => {
  const newEntityStatus = "succeeded";
  const action = todolistsActions.changeTodolistEntityStatus({ todoId: todoId1, entityStatus: newEntityStatus });
  const endState = todolistsSlice(initialState, action);

  expect(endState.length).toBe(2);
  expect(endState[0].entityStatus).toBe(newEntityStatus);
  expect(endState[1].entityStatus).toBe("idle");
});

test("set todolists should be correct", () => {
  const newTodolists: TodoListTypeDomain[] = Array.from({ length: 10 })
    .fill(0)
    .map((_, index) => getTodolist("todoId" + index, "New Todolist" + index));
  const action = todolistsActions.fetchTodolists.fulfilled({ todolists: newTodolists }, "requestId");
  const endState = todolistsSlice(initialState, action);

  expect(endState.length).toBe(10);
  expect(endState[0].title).toBe("New Todolist0");
  expect(endState[9].title).toBe("New Todolist9");
  expect(endState.every((tl) => tl.entityStatus === "idle" && tl.filter === "all")).toBeTruthy();
});

test("clear all todolists data should be correct", () => {
  const action = todolistsActions.clearTodosData();
  const endState = todolistsSlice(initialState, action);

  expect(endState.length).toBe(0);
  expect(endState[0]).toBeUndefined();
  expect(endState).toEqual([]);
});
