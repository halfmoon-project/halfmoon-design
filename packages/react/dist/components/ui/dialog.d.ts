import * as React from "react";
import { Dialog } from "radix-ui";

//#region src/components/ui/dialog.d.ts
declare function Dialog$1({
  ...props
}: React.ComponentProps<typeof Dialog.Root>): React.JSX.Element;
declare function DialogTrigger({
  ...props
}: React.ComponentProps<typeof Dialog.Trigger>): React.JSX.Element;
declare function DialogPortal({
  ...props
}: React.ComponentProps<typeof Dialog.Portal>): React.JSX.Element;
declare function DialogClose({
  ...props
}: React.ComponentProps<typeof Dialog.Close>): React.JSX.Element;
declare function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof Dialog.Overlay>): React.JSX.Element;
declare function DialogContent({
  className,
  children,
  showCloseButton,
  ...props
}: React.ComponentProps<typeof Dialog.Content> & {
  showCloseButton?: boolean;
}): React.JSX.Element;
declare function DialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">): React.JSX.Element;
declare function DialogFooter({
  className,
  showCloseButton,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean;
}): React.JSX.Element;
declare function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof Dialog.Title>): React.JSX.Element;
declare function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof Dialog.Description>): React.JSX.Element;
//#endregion
export { Dialog$1 as Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger };