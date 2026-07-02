import * as React from "react";
import { VariantProps } from "class-variance-authority";

//#region src/components/ui/button.d.ts
declare const buttonVariants: (props?: ({
  variant?: "default" | "destructive" | "ghost" | "link" | "outline" | "secondary" | null | undefined;
  size?: "default" | "icon" | "icon-lg" | "icon-sm" | "icon-xs" | "lg" | "sm" | "xs" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare function Button({
  className,
  variant,
  size,
  asChild,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & {
  asChild?: boolean;
}): React.JSX.Element;
//#endregion
export { Button, buttonVariants };