import {v1} from "uuid";
import {TasksStateType} from "../../App";
import {addNewTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./tasksReducer";
import {
  addNewTodolistAC,
  removeAllTodoListsAC,
  removeTodolistAC,
  todolistsReducer
} from "../todolists/todolistsReducer";

const todoId1 = v1();
const todoId2 = v1();
const taskTL1Id1 = v1();
const taskTL2Id1 = v1();

let initialState: TasksStateType;

beforeEach(() => {
  initialState = {
    [todoId1]: [
      {id: taskTL1Id1, title: 'HTML&CSS', isDone: true},
      {id: v1(), title: 'JS', isDone: true},
      {id: v1(), title: 'ReactJS', isDone: false},
      {id: v1(), title: 'Redux', isDone: false},
    ],
    [todoId2]: [
      {id: taskTL2Id1, title: 'Books', isDone: false},
      {id: v1(), title: 'Juice', isDone: true},
    ],
  }
})

test('remove task should be correct', () => {

  const action = removeTaskAC(todoId1, taskTL1Id1)
  const endState = tasksReducer(initialState, action);

  expect(endState[todoId1].length).toBe(3);
  expect(endState[todoId2].length).toBe(2);

  expect(endState[todoId1][0].id).not.toBe(taskTL1Id1);
  expect(endState[todoId1].find(t => t.id === taskTL1Id1)).toBe(undefined);
})

test('change task status should be correct', () => {

  const action = changeTaskStatusAC(todoId1, taskTL1Id1, false)
  const endState = tasksReducer(initialState, action);

  expect(endState[todoId1].length).toBe(4);
  expect(endState[todoId2].length).toBe(2);

  expect(endState[todoId1][0].id).toBe(taskTL1Id1);
  expect(endState[todoId1][0].isDone).toBe(false);
  expect(endState[todoId1][1].isDone).toBe(true);

})

test('add new task should be correct', () => {

  const action = addNewTaskAC(todoId1, 'New Task')
  const endState = tasksReducer(initialState, action);

  expect(endState[todoId1].length).toBe(5);
  expect(endState[todoId2].length).toBe(2);

  expect(endState[todoId1][1].id).toBe(taskTL1Id1);
  expect(endState[todoId1][0].title).toBe('New Task');

})

test('change task title should be correct', () => {

  const action = changeTaskTitleAC(todoId1, taskTL1Id1, 'New title')
  const endState = tasksReducer(initialState, action);

  expect(endState[todoId1].length).toBe(4);
  expect(endState[todoId2].length).toBe(2);

  expect(endState[todoId1][0].id).toBe(taskTL1Id1);
  expect(endState[todoId1][0].title).toBe('New title');
  expect(endState[todoId1][1].title).toBe('JS');

})

test('add empty array of tasks for new todolist should be correct', () => {

  const newId = v1();
  const action = addNewTodolistAC('New title', newId)
  const endState = tasksReducer(initialState, action);

  const keys = Object.keys(endState);

  expect(keys.length).toBe(3);
  expect(endState[newId]).toEqual([]);

})

test('delete array of tasks when todolist is removed should be correct', () => {

  const action = removeTodolistAC(todoId1)
  const endState = tasksReducer(initialState, action);

  const keys = Object.keys(endState);

  expect(keys.length).toBe(1);
  expect(endState[todoId1]).toBeFalsy();

})

test('delete all tasks when todoLists are removed should be correct', () => {

  const action = removeAllTodoListsAC();
  const endState = tasksReducer(initialState, action);

  const keys = Object.keys(endState);

  expect(keys.length).toBe(0);
  expect(endState).toEqual({});
})