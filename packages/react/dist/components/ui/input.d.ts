import * as React from "react";

//#region src/components/ui/input.d.ts
declare function Input({
  className,
  type,
  ...props
}: React.ComponentProps<"input">): React.JSX.Element;
//#endregion
export { Input };