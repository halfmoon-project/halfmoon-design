import * as React from "react";
import { DropdownMenu } from "radix-ui";

//#region src/components/ui/dropdown-menu.d.ts
declare function DropdownMenu$1({
  ...props
}: React.ComponentProps<typeof DropdownMenu.Root>): React.JSX.Element;
declare function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenu.Portal>): React.JSX.Element;
declare function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenu.Trigger>): React.JSX.Element;
declare function DropdownMenuContent({
  className,
  sideOffset,
  ...props
}: React.ComponentProps<typeof DropdownMenu.Content>): React.JSX.Element;
declare function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenu.Group>): React.JSX.Element;
declare function DropdownMenuItem({
  className,
  inset,
  variant,
  ...props
}: React.ComponentProps<typeof DropdownMenu.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}): React.JSX.Element;
declare function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenu.CheckboxItem>): React.JSX.Element;
declare function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenu.RadioGroup>): React.JSX.Element;
declare function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenu.RadioItem>): React.JSX.Element;
declare function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenu.Label> & {
  inset?: boolean;
}): React.JSX.Element;
declare function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenu.Separator>): React.JSX.Element;
declare function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">): React.JSX.Element;
declare function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenu.Sub>): React.JSX.Element;
declare function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenu.SubTrigger> & {
  inset?: boolean;
}): React.JSX.Element;
declare function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenu.SubContent>): React.JSX.Element;
//#endregion
export { DropdownMenu$1 as DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger };