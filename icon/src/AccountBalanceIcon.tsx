import * as React from "react";
import { IconProps } from "./types";

const SvgComponent = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={24} width={24} {...props}>
    <path fill="none" d="M0 0h24v24H0z" />
    <path d="M4 10h3v7H4zM10.5 10h3v7h-3zM2 19h20v3H2zM17 10h3v7h-3zM12 1 2 6v2h20V6z" />
  </svg>
);

export default SvgComponent;
