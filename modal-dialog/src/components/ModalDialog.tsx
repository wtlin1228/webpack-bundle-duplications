import * as React from "react";
import { Button } from "@wtlin1228/button2";
import { RotationIcon, UnitIcon } from "@wtlin1228/icon";

export interface ModalDialogProps {
  question: string;
}

const ModalDialog = (props: ModalDialogProps) => {
  const [decision, setDecision] = React.useState<null | string>(null);
  return (
    <div style={{ height: 200, background: "#9acdb6" }}>
      <RotationIcon className="" />
      <UnitIcon className="" />
      <RotationIcon className="" />
      <UnitIcon className="" />
      <RotationIcon className="" />
      <UnitIcon className="" />
      <RotationIcon className="" />
      <UnitIcon className="" />

      <div>
        <h1>{props.question}</h1>
        {decision && <p>Your answer is {decision}</p>}
      </div>

      <Button
        text="no"
        onClick={() => {
          setDecision("No");
        }}
        iconProps={{
          className: "",
        }}
      />

      <Button
        text="yes"
        onClick={() => {
          setDecision("Yes");
        }}
        iconProps={{
          className: "",
        }}
      />
    </div>
  );
};

export default ModalDialog;
