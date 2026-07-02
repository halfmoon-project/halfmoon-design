import * as React from "react";
import { Switch } from "radix-ui";

//#region src/components/ui/switch.d.ts
declare function Switch$1({
  className,
  size,
  ...props
}: React.ComponentProps<typeof Switch.Root> & {
  size?: "sm" | "default";
}): React.JSX.Element;
//#endregion
export { Switch$1 as Switch };