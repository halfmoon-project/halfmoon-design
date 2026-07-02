import * as React from "react";

//#region src/components/ui/card.d.ts
declare function Card({
  className,
  ...props
}: React.ComponentProps<"div">): React.JSX.Element;
declare function CardHeader({
  className,
  ...props
}: React.ComponentProps<"div">): React.JSX.Element;
declare function CardTitle({
  className,
  ...props
}: React.ComponentProps<"div">): React.JSX.Element;
declare function CardDescription({
  className,
  ...props
}: React.ComponentProps<"div">): React.JSX.Element;
declare function CardAction({
  className,
  ...props
}: React.ComponentProps<"div">): React.JSX.Element;
declare function CardContent({
  className,
  ...props
}: React.ComponentProps<"div">): React.JSX.Element;
declare function CardFooter({
  className,
  ...props
}: React.ComponentProps<"div">): React.JSX.Element;
//#endregion
export { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };