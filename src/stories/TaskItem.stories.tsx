// import type { Meta, StoryObj } from "@storybook/react";
// import { Task } from "components/Task/Task";
// import { action } from "@storybook/addon-actions";
// import { bool, string } from "prop-types";
//
// // More on how to set up stories at:
// // https://storybook.js.org/docs/react/writing-stories/introduction#default-export
// const meta: Meta<typeof Task> = {
//   title: "TODOLISTS/Task",
//   component: Task,
//   // This component will have an automatically generated Autodocs entry:
//   // https://storybook.js.org/docs/react/writing-docs/autodocs
//   tags: ["autodocs"],
//   // More on argTypes:
//   // https://storybook.js.org/docs/react/api/argtypes
//   argTypes: {
//     id: string,
//     todoId: string,
//     isDone: bool,
//     title: string,
//     updateTask: action("updateTask"),
//     removeTask: action("removeTask"),
//   },
// };
//
// export default meta;
// type Story = StoryObj<typeof Task>;
//
// // More on component templates:
// // https://storybook.js.org/docs/react/writing-stories/introduction#using-args
// export const TaskIsNotDoneStory: Story = {};
//
// export const TaskIsDoneStory: Story = {
//   // More on args: https://storybook.js.org/docs/react/writing-stories/args
//   args: {
//     id: "12wsdewfijdei2343",
//     title: "CSS",
//     isDone: true,
//   },
// };
