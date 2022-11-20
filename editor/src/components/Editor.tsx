import * as React from "react";
import { Button } from "@wtlin1228/button2";

const Editor = () => {
  return (
    <div style={{ height: 400, background: "#d0f5ab" }}>
      <Button
        text="Click to edit"
        onClick={() => {
          console.log("edit~");
        }}
        iconProps={{
          className: "",
        }}
      />
    </div>
  );
};

export default Editor;
