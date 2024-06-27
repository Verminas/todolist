import {v1} from "uuid";
import {TasksStateType, TodolistType} from "../App";
import {addNewTodolistAC, removeAllTodoListsAC, removeTodolistAC, todolistsReducer} from "./todolists/todolistsReducer";
import {tasksReducer} from "./tasks/tasksReducer";

const tdId1 = v1();
const tdId2 = v1();

let initialTasks: TasksStateType;
let initialTodoLists: TodolistType[];

beforeEach(() => {
  initialTasks = {
    [tdId1]: [
      {id: v1(), title: 'HTML&CSS', isDone: true},
      {id: v1(), title: 'JS', isDone: true},
    ],
    [tdId2]: [
      {id: v1(), title: 'Books', isDone: false},
      {id: v1(), title: 'Juice', isDone: true},
    ],
  }

  initialTodoLists = [
    {id: tdId1, title: 'What to learn', filter: 'all'},
    {id: tdId2, title: 'What to buy', filter: 'all'},
  ]
})

test('add new todolist with empty array of tasks should be correct', () => {
  const tdId = v1();

  const action = addNewTodolistAC('Title of New Todolist', tdId )
  const endTodoLists = todolistsReducer(initialTodoLists, action);
  const endTasks = tasksReducer(initialTasks, action);

  expect(endTodoLists.length).toBe(3);
  expect(endTodoLists.find(tl => tl.id === tdId)).toBeTruthy()
  expect(endTasks[tdId]).toBeTruthy();
  expect(endTasks[tdId]).toEqual([]);
})

test('remove todolist and array with tasks should be correct', () => {

  const action = removeTodolistAC(tdId1 )
  const endTodoLists = todolistsReducer(initialTodoLists, action);
  const endTasks = tasksReducer(initialTasks, action);

  const keys = Object.keys(endTasks)

  expect(endTodoLists.length).toBe(1);
  expect(endTodoLists.find(tl => tl.id === tdId1)).toBeUndefined()
  expect(keys.length).toBe(1);
  expect(endTasks[tdId1]).toBeUndefined();
})

test('remove all todoLists and array with tasks should be correct', () => {

  const action = removeAllTodoListsAC()
  const endTodoLists = todolistsReducer(initialTodoLists, action);
  const endTasks = tasksReducer(initialTasks, action);

  const keys = Object.keys(endTasks)

  expect(endTodoLists.length).toBe(0);
  expect(keys.length).toBe(0);
  expect(endTodoLists).toEqual([]);
  expect(endTasks).toEqual({});
})