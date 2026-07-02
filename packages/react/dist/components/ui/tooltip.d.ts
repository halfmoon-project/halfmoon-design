import * as React from "react";
import { Tooltip } from "radix-ui";

//#region src/components/ui/tooltip.d.ts
declare function TooltipProvider({
  delayDuration,
  ...props
}: React.ComponentProps<typeof Tooltip.Provider>): React.JSX.Element;
declare function Tooltip$1({
  ...props
}: React.ComponentProps<typeof Tooltip.Root>): React.JSX.Element;
declare function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof Tooltip.Trigger>): React.JSX.Element;
declare function TooltipContent({
  className,
  sideOffset,
  children,
  ...props
}: React.ComponentProps<typeof Tooltip.Content>): React.JSX.Element;
//#endregion
export { Tooltip$1 as Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };