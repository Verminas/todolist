import type {Meta, StoryObj} from '@storybook/react';
import {TaskItem} from './TaskItem';
import {action} from '@storybook/addon-actions'
import {bool, string} from "prop-types";

// More on how to set up stories at:
// https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof TaskItem> = {
  title: 'TODOLISTS/TaskItem',
  component: TaskItem,
  // This component will have an automatically generated Autodocs entry:
  // https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes:
  // https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    id: string,
    todoId: string,
    isDone: bool,
    title: string,
    changeStatus: action('changeStatus'),
    changeTitle: action('changeTitle'),
    removeTask: action('removeTask'),
  },
};

export default meta;
type Story = StoryObj<typeof TaskItem>;

// More on component templates:
// https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const TaskIsNotDoneStory: Story = {};

export const TaskIsDoneStory: Story = {
  // More on args: https://storybook.js.org/docs/react/writing-stories/args
  args: {
    id: '12wsdewfijdei2343',
    title: 'CSS',
    isDone: true,
  },
};