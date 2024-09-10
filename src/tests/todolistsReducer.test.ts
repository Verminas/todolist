import { v1 } from "uuid";
import {
  changeFilter,
  changeTitle,
  changeTodolistEntityStatus,
  clearTodosData,
  createTodolist,
  removeAllTodoLists,
  removeTodolist,
  todolistsReducer,
  todolistsThunks,
  TodolistType,
} from "features/TodolistsList/todolistsReducer";
import { TodoListTypeDomain } from "api/todolistsApi";

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
  const action = removeTodolist({ todoId: todoId1 });
  const endState = todolistsReducer(initialState, action);

  expect(endState.length).toBe(1);
  expect(endState[0].id).toBe(todoId2);
});

test("remove all todolists should be correct", () => {
  const action = removeAllTodoLists();
  const endState = todolistsReducer(initialState, action);

  expect(endState.length).toBe(0);
  expect(endState[0]).toBeUndefined();
  expect(endState).toEqual([]);
});

test("change filter in todolist should be correct", () => {
  const action = changeFilter({ todoId: todoId1, filter: "active" });
  const endState = todolistsReducer(initialState, action);

  expect(endState.length).toBe(2);
  expect(endState[0].filter).toBe("active");
  expect(endState[1].filter).toBe("all");
});

test("create new todolist should be correct", () => {
  const newTodo = getTodolist(v1(), "New Todo");
  const action = createTodolist({ todo: newTodo });
  const endState = todolistsReducer(initialState, action);

  expect(endState.length).toBe(3);
  expect(endState[0].title).toBe(newTodo.title);
  expect(endState[1].id).toBe(todoId1);
});

test("change title in todolist should be correct", () => {
  const newTitle = "Changed Title";
  const action = changeTitle({ todoId: todoId1, title: newTitle });
  const endState = todolistsReducer(initialState, action);

  expect(endState.length).toBe(2);
  expect(endState[0].title).toBe(newTitle);
  expect(endState[1].title).toBe(todo2Title);
});

test("change todolist entity status should be correct", () => {
  const newEntityStatus = "succeeded";
  const action = changeTodolistEntityStatus({ todoId: todoId1, entityStatus: newEntityStatus });
  const endState = todolistsReducer(initialState, action);

  expect(endState.length).toBe(2);
  expect(endState[0].entityStatus).toBe(newEntityStatus);
  expect(endState[1].entityStatus).toBe("idle");
});

test("set todolists should be correct", () => {
  const newTodolists: TodoListTypeDomain[] = Array.from({ length: 10 })
    .fill(0)
    .map((_, index) => getTodolist("todoId" + index, "New Todolist" + index));
  const action = todolistsThunks.fetchTodolists.fulfilled({ todolists: newTodolists }, "requestId");
  const endState = todolistsReducer(initialState, action);

  expect(endState.length).toBe(10);
  expect(endState[0].title).toBe("New Todolist0");
  expect(endState[9].title).toBe("New Todolist9");
  expect(endState.every((tl) => tl.entityStatus === "idle" && tl.filter === "all")).toBeTruthy();
});

test("clear all todolists data should be correct", () => {
  const action = clearTodosData();
  const endState = todolistsReducer(initialState, action);

  expect(endState.length).toBe(0);
  expect(endState[0]).toBeUndefined();
  expect(endState).toEqual([]);
});
