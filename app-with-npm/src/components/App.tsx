import * as React from "react";
import { Button } from "@wtlin1228/button2";
import { Editor } from "@wtlin1228/editor2";
import { AddCommentIcon } from "@wtlin1228/icon";
import { ModalDialog } from "@wtlin1228/modal-dialog";

const App = () => {
  return (
    <div>
      <Button
        text="I'm a button"
        onClick={() => {
          console.log("U clicks a button");
        }}
      />

      <Editor />

      <ModalDialog question="Do you like cats?" />

      <AddCommentIcon className="" />
      <AddCommentIcon className="" />
      <AddCommentIcon className="" />
      <AddCommentIcon className="" />
      <AddCommentIcon className="" />
    </div>
  );
};

export default App;
