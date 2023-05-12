import { Example as AruiExample, ExampleProps } from "./Example";
import { Meta } from "@storybook/react";
import { Story } from "@storybook/react/types-6-0";

export default {
  title: "components/Project/Example",
  component: AruiExample,
} as Meta;

export const Example: Story<ExampleProps> = (args: ExampleProps) => {
  return <AruiExample {...args} />;
};

Example.storyName = "Example";
