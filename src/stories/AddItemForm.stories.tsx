import type { Meta, StoryObj } from "@storybook/react";
import { AddItemForm } from "common/components/AddItemForm/AddItemForm";
import { action } from "@storybook/addon-actions";

// More on how to set up stories at:
// https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof AddItemForm> = {
  title: "TODOLISTS/AddItemForm",
  component: AddItemForm,
  // This component will have an automatically generated Autodocs entry:
  // https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes:
  // https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    addItem: {
      description: "Button clicked inside form",
      action: "clicked",
    },
  },
};

export default meta;
type Story = StoryObj<typeof AddItemForm>;

// More on component templates:
// https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const AddItemFormStory: Story = {
  // More on args: https://storybook.js.org/docs/react/writing-stories/args
  args: {
    addItem: () => Promise.resolve("Button clicked inside form"),
  },
};
