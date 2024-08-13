import {v1} from "uuid";
import {
  createTodolistAC,
  changeFilterAC,
  changeTitleAC,
  removeAllTodoListsAC,
  removeTodolistAC,
  todolistsReducer, TodolistType
} from "./todolistsReducer";

const todoId1 = v1();
const todoId2 = v1();
let initialState: TodolistType[];

beforeEach(() => {
  initialState = [
    {id: todoId1, title: 'What to learn', filter: 'all', order: 0, addedDate: '', entityStatus: 'idle'},
    {id: todoId2, title: 'What to buy', filter: 'all', order: 0, addedDate: '', entityStatus: 'idle'},
  ]
})

test('remove todolist should be correct', () => {

  const action = removeTodolistAC(todoId1)
  const endState = todolistsReducer(initialState, action);

  expect(endState.length).toBe(1);
  expect(endState[0].id).toBe(todoId2);
})

test('remove all todolists should be correct', () => {

  const action = removeAllTodoListsAC();
  const endState = todolistsReducer(initialState, action);

  expect(endState.length).toBe(0);
  expect(endState[0]).toBeUndefined();
})

test('change filter in todolist should be correct', () => {

  const action = changeFilterAC(todoId1, 'active')
  const endState = todolistsReducer(initialState, action);

  expect(endState.length).toBe(2);
  expect(endState[0].filter).toBe('active');
  expect(endState[1].filter).toBe('all');

})

test('add new todolist should be correct', () => {

  const action = createTodolistAC({title: 'New Todolist', addedDate: '', order: 0, id: 'saadf'});
  const endState = todolistsReducer(initialState, action);

  expect(endState.length).toBe(3);
  expect(endState[0].title).toBe('New Todolist');
  expect(endState[1].id).toBe(todoId1);
})

test('change title in todolist should be correct', () => {

  const action = changeTitleAC(todoId1, 'New Title')
  const endState = todolistsReducer(initialState, action);

  expect(endState.length).toBe(2);
  expect(endState[0].title).toBe('New Title');
  expect(endState[1].title).toBe('What to buy');

})