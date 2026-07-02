import * as React from "react";
import { Select } from "radix-ui";

//#region src/components/ui/select.d.ts
declare function Select$1({
  ...props
}: React.ComponentProps<typeof Select.Root>): React.JSX.Element;
declare function SelectGroup({
  ...props
}: React.ComponentProps<typeof Select.Group>): React.JSX.Element;
declare function SelectValue({
  ...props
}: React.ComponentProps<typeof Select.Value>): React.JSX.Element;
declare function SelectTrigger({
  className,
  size,
  children,
  ...props
}: React.ComponentProps<typeof Select.Trigger> & {
  size?: "sm" | "default";
}): React.JSX.Element;
declare function SelectContent({
  className,
  children,
  position,
  align,
  ...props
}: React.ComponentProps<typeof Select.Content>): React.JSX.Element;
declare function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof Select.Label>): React.JSX.Element;
declare function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Select.Item>): React.JSX.Element;
declare function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Select.Separator>): React.JSX.Element;
declare function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof Select.ScrollUpButton>): React.JSX.Element;
declare function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof Select.ScrollDownButton>): React.JSX.Element;
//#endregion
export { Select$1 as Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue };