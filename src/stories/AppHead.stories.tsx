import type { Meta, StoryObj } from "@storybook/react";
import { AppHead } from "common/components/AppHead/AppHead";
import { action } from "@storybook/addon-actions";

// More on how to set up stories at:
// https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof AppHead> = {
  title: "TODOLISTS/AppHead",
  component: AppHead,
  // This component will have an automatically generated Autodocs entry:
  // https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes:
  // https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    switchOnChange: {
      description: "Switch clicked inside AppHead",
      action: "clicked",
    },
  },
};

export default meta;
type Story = StoryObj<typeof AppHead>;

// More on component templates:
// https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const AppHeadStory: Story = {
  // More on args: https://storybook.js.org/docs/react/writing-stories/args
  args: {
    switchOnChange: action("Switch clicked inside AppHead"),
  },
};
