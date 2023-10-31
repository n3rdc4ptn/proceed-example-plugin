import React from "react";
import { Button, PluginUIComponent } from "proceed-plugin-sdk";

const Demo: PluginUIComponent = ({ context }) => {
  return (
    <>
      <p>Hello world!</p>
      <Button label="Test" />
    </>
  );
};

export default Demo;
