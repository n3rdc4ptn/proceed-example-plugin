import React from "react";
import { PluginUIComponent, ExampleProcessType } from "proceed-plugin-sdk";

const App: PluginUIComponent = ({ context }) => {
  const data = context.data as [ExampleProcessType];
  console.log(data);

  return (
    <>
      <div>This is a custom process list.</div>
      <ul>
        {data.map((process) => (
          <li key={process.definitionId}>{process.definitionName}</li>
        ))}
      </ul>
    </>
  );
};

export default App;
