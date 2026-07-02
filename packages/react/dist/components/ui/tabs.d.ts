import * as React from "react";
import { VariantProps } from "class-variance-authority";
import { Tabs } from "radix-ui";

//#region src/components/ui/tabs.d.ts
declare function Tabs$1({
  className,
  orientation,
  ...props
}: React.ComponentProps<typeof Tabs.Root>): React.JSX.Element;
declare const tabsListVariants: (props?: ({
  variant?: "default" | "line" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare function TabsList({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof Tabs.List> & VariantProps<typeof tabsListVariants>): React.JSX.Element;
declare function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof Tabs.Trigger>): React.JSX.Element;
declare function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof Tabs.Content>): React.JSX.Element;
//#endregion
export { Tabs$1 as Tabs, TabsContent, TabsList, TabsTrigger, tabsListVariants };