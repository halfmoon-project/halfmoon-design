import * as React from "react";
import { VariantProps } from "class-variance-authority";

//#region src/components/ui/badge.d.ts
declare const badgeVariants: (props?: ({
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare function Badge({
  className,
  variant,
  asChild,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & {
  asChild?: boolean;
}): React.JSX.Element;
//#endregion
export { Badge, badgeVariants };