import type { Meta, StoryObj } from "@storybook/react";
import { Todolist } from "./Todolist";
import { action } from "@storybook/addon-actions";
import { bool, string } from "prop-types";
import { TaskPropsType } from "../tasksReducer";
import { v1 } from "uuid";

// More on how to set up stories at:
// https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Todolist> = {
  title: "TODOLISTS/Todolist",
  component: Todolist,
  // This component will have an automatically generated Autodocs entry:
  // https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes:
  // https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    id: string,
    title: string,
    tasks: Array<TaskPropsType>,
    changeTitleTodolist: {
      description: "changeTitleTodolist",
      action: action("changeTitleTodolist"),
    },
    updateTask: {
      description: "updateTask",
      action: action("updateTask"),
    },
    removeTask: {
      description: "removeTask",
      action: action("removeTask"),
    },
    changeFilter: {
      description: "changeFilter",
      action: action("changeFilter"),
    },
    removeTodolist: {
      description: "removeTodolist",
      action: action("removeTodolist"),
    },
    addTask: {
      description: "addTask",
      action: action("addTask"),
    },
    filter: string,
  },
};

export default meta;
type Story = StoryObj<typeof Todolist>;

// More on component templates:
// https://storybook.js.org/docs/react/writing-stories/introduction#using-args

export const TodolistStory: Story = {
  // More on args: https://storybook.js.org/docs/react/writing-stories/args
  args: {
    id: "12wsdewfijdei2343",
    title: "Todolist",
    tasks: [
      {
        id: v1(),
        title: "HTML&CSS",
        isDone: true,
        completed: false,
        status: 0,
        addedDate: "",
        order: 0,
        priority: 0,
        startDate: "",
        deadline: "",
        description: "",
        todoListId: "sdf",
        entityStatus: "idle",
      },
      {
        id: v1(),
        title: "JS",
        isDone: true,
        completed: false,
        status: 0,
        addedDate: "",
        order: 0,
        priority: 0,
        startDate: "",
        deadline: "",
        description: "",
        todoListId: "sdf",
        entityStatus: "idle",
      },
      {
        id: v1(),
        title: "ReactJS",
        isDone: false,
        completed: false,
        status: 0,
        addedDate: "",
        order: 0,
        priority: 0,
        startDate: "",
        deadline: "",
        description: "",
        todoListId: "sdf",
        entityStatus: "idle",
      },
      {
        id: v1(),
        title: "Redux",
        isDone: false,
        completed: false,
        status: 0,
        addedDate: "",
        order: 0,
        priority: 0,
        startDate: "",
        deadline: "",
        description: "",
        todoListId: "sdf",
        entityStatus: "idle",
      },
    ],
    filter: "all",
  },
};
