import * as React from "react";
import { IconProps } from "./types";

const SvgComponent = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={24} width={24} {...props}>
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M9 7H7v5H5V7H3v7h4v3h2v-3h2v-2H9V7zm8 4v2h2v2h-5V9h7V7h-9v10h9v-6h-4z" />
  </svg>
);

export default SvgComponent;
