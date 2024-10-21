import type { Meta, StoryObj } from "@storybook/react";
import { EditableSpan } from "common/components/EditableSpan/EditableSpan";
import { action } from "@storybook/addon-actions";
import { string } from "prop-types";

// More on how to set up stories at:
// https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof EditableSpan> = {
  title: "TODOLISTS/EditableSpan",
  component: EditableSpan,
  // This component will have an automatically generated Autodocs entry:
  // https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes:
  // https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    title: {
      description: "Start value empty. Add value push button set string.",
    },
    changeTitle: {
      description: "Value EditableSpan changed",
    },
    textFieldLabel: string,
  },
};

export default meta;
type Story = StoryObj<typeof EditableSpan>;

// More on component templates:
// https://storybook.js.org/docs/react/writing-stories/introduction#using-args

export const EditableSpanStory: Story = {
  // More on args: https://storybook.js.org/docs/react/writing-stories/args
  args: {
    changeTitle: action("Value EditableSpan changed"),
    title: "EditableSpan",
  },
};
