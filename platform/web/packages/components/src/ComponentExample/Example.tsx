export interface ExampleProps {}

export const Example = (props: ExampleProps) => {
  console.log(props);
  return <p>I am an example</p>;
};
