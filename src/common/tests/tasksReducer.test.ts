import { v1 } from "uuid";
import { TaskPropsType, tasksActions, tasksReducer, TasksStateType } from "features/TodolistsList/tasksSlice";
import { RequestStatusType } from "app/appSlice";
import { todolistsActions } from "features/TodolistsList/todolistsSlice";
import { TodoListTypeDomain } from "features/TodolistsList/todolistsApi";
import { getTodolist } from "common/tests/todolistsReducer.test";
import { TaskPriorities, TaskStatuses } from "common/enums";

const todoId1 = v1();
const todoId2 = v1();
const taskTL1Id1 = v1();
const taskTL2Id1 = v1();
const taskTitle1 = "Title 1 for todolist 1";
const taskTitle2 = "Title 1 for todolist 2";
const taskIsDone1 = true;
const taskIsDone2 = false;
const taskEntityStatus1: RequestStatusType = "loading";
const taskEntityStatus2: RequestStatusType = "idle";

let initialState: TasksStateType;

function getTask(
  taskTitle: string,
  taskId: string,
  taskIsDone: boolean,
  taskEntityStatus: RequestStatusType,
  todoId: string,
): TaskPropsType {
  return {
    title: taskTitle,
    id: taskId,
    isDone: taskIsDone,
    status: taskIsDone ? TaskStatuses.inProgress : TaskStatuses.New,
    entityStatus: taskEntityStatus,
    todoListId: todoId,
    description: "",
    deadline: "",
    startDate: "",
    priority: TaskPriorities.Low,
    order: 0,
    addedDate: "",
    completed: false,
  };
}

function getTasksInitialState(
  id1: string,
  id2: string,
  taskId1: string,
  taskId2: string,
  taskTitle1: string,
  taskTitle2: string,
  taskIsDone1: boolean,
  taskIsDone2: boolean,
  taskEntityStatus1: RequestStatusType,
  taskEntityStatus2: RequestStatusType,
): TasksStateType {
  return {
    [id1]: [getTask(taskTitle1, taskId1, taskIsDone1, taskEntityStatus1, id1)],
    [id2]: [getTask(taskTitle2, taskId2, taskIsDone2, taskEntityStatus2, id2)],
  };
}

beforeEach(() => {
  initialState = getTasksInitialState(
    todoId1,
    todoId2,
    taskTL1Id1,
    taskTL2Id1,
    taskTitle1,
    taskTitle2,
    taskIsDone1,
    taskIsDone2,
    taskEntityStatus1,
    taskEntityStatus2,
  );
});

test("remove task should be correct", () => {
  const dataModel = { todoId: todoId1, taskId: taskTL1Id1 };
  const action = tasksActions.removeTask.fulfilled(dataModel, "requestId", dataModel);
  const endState = tasksReducer(initialState, action);

  expect(endState[todoId1].length).toBe(0);
  expect(endState[todoId2].length).toBe(1);

  expect(endState[todoId1].find((t) => t.id === taskTL1Id1)).toBe(undefined);
});

test("update task status and title should be correct", () => {
  const newTitle = "Updated task title";
  const newStatus = false;
  const updatedTask = getTask(newTitle, taskTL1Id1, newStatus, "succeeded", todoId1);
  const action = tasksActions.updateTask.fulfilled(updatedTask, "requestId", updatedTask);
  const endState = tasksReducer(initialState, action);

  expect(endState[todoId1].length).toBe(1);
  expect(endState[todoId2].length).toBe(1);

  expect(endState[todoId1][0].id).toBe(taskTL1Id1);
  expect(endState[todoId1][0].isDone).toBe(newStatus);
  expect(endState[todoId1][0].title).toBe(newTitle);
});

test("add new task should be correct", () => {
  const taskTitle = "Title of new task";
  const taskId = v1();
  const taskStatus = false;

  const newTask = getTask(taskTitle, taskId, taskStatus, "succeeded", todoId1);
  const action = tasksActions.createTask.fulfilled({ todoId: todoId1, task: newTask }, "requestId", {
    todoId: newTask.todoListId,
    title: newTask.title,
  });
  const endState = tasksReducer(initialState, action);

  expect(endState[todoId1].length).toBe(2);
  expect(endState[todoId2].length).toBe(1);

  expect(endState[todoId1][0].id).toBe(taskId);
  expect(endState[todoId1][0].title).toBe(taskTitle);
  expect(endState[todoId1][0].isDone).toBe(taskStatus);
});

test("set tasks for todolist should be correct", () => {
  const newTasks: TaskPropsType[] = Array.from({ length: 10 })
    .fill(0)
    .map((_, index) => getTask("new title", "new title" + index, false, "succeeded", todoId1));

  const action = tasksActions.fetchTasks.fulfilled({ todoId: todoId1, tasks: newTasks }, "requestId", todoId1);
  const endState = tasksReducer(initialState, action);

  expect(endState[todoId1].length).toBe(10);
  expect(endState[todoId2].length).toBe(1);

  expect(endState[todoId1][0].id).toBe("new title0");
  expect(endState[todoId1][0].title).toBe("new title");
  expect(endState[todoId1][0].isDone).toBe(false);
});

test("change task entity status should be correct", () => {
  const newEntityStatus = "succeeded";

  const action = tasksActions.changeTaskEntityStatus({
    todoId: todoId1,
    taskId: taskTL1Id1,
    entityStatus: newEntityStatus,
  });
  const endState = tasksReducer(initialState, action);

  expect(endState[todoId1].length).toBe(1);

  expect(endState[todoId1][0].entityStatus).toBe("succeeded");
});

test("set empty array for each todolists should be correct", () => {
  const newTodolists: TodoListTypeDomain[] = Array.from({ length: 10 })
    .fill(0)
    .map((_, index) => getTodolist("todoId" + index, "New todolist" + index));

  const action = todolistsActions.fetchTodolists.fulfilled({ todolists: newTodolists }, "requestId");
  const endState = tasksReducer(initialState, action);

  expect(endState["todoId" + 0]).toBeDefined();
  expect(endState["todoId" + 9]).toBeDefined();
  expect(endState["todoId" + 0]).toEqual([]);
  expect(endState["todoId" + 9]).toEqual([]);

  expect(newTodolists.every((tl) => Array.isArray(endState[tl.id]))).toBeTruthy();
});

test("add empty array of tasks for new todolist should be correct", () => {
  const newId = v1();
  const newTitle = "New todolist";

  const action = todolistsActions.createTodolist.fulfilled(
    { todolist: getTodolist(newId, newTitle) },
    "requestId",
    newTitle,
  );
  const endState = tasksReducer(initialState, action);

  const keys = Object.keys(endState);

  expect(keys.length).toBe(3);
  expect(endState[newId]).toEqual([]);
});

test("delete array of tasks when todolist is removed should be correct", () => {
  const action = todolistsActions.removeTodolist.fulfilled({ todoId: todoId1 }, "requestId", todoId1);
  const endState = tasksReducer(initialState, action);

  const keys = Object.keys(endState);

  expect(keys.length).toBe(1);
  expect(endState[todoId1]).toBeFalsy();
});

test("delete all tasks when todoLists are removed should be correct", () => {
  const action = todolistsActions.removeAllTodolists.fulfilled(undefined, "requestId", undefined);
  const endState = tasksReducer(initialState, action);

  const keys = Object.keys(endState);

  expect(keys.length).toBe(0);
  expect(endState).toEqual({});
});
