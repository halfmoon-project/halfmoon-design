import { cn } from "../../lib/utils.js";
import "react";
import { Checkbox } from "radix-ui";
import { jsx } from "react/jsx-runtime";
import { CheckIcon } from "lucide-react";
//#region src/components/ui/checkbox.tsx
function Checkbox$1({ className, ...props }) {
	return /* @__PURE__ */ jsx(Checkbox.Root, {
		"data-slot": "checkbox",
		className: cn("peer size-4 shrink-0 rounded-[4px] border border-input shadow-xs transition-shadow outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:bg-input/30 dark:aria-invalid:ring-destructive/40 dark:data-[state=checked]:bg-primary", className),
		...props,
		children: /* @__PURE__ */ jsx(Checkbox.Indicator, {
			"data-slot": "checkbox-indicator",
			className: "grid place-content-center text-current transition-none",
			children: /* @__PURE__ */ jsx(CheckIcon, { className: "size-3.5" })
		})
	});
}
//#endregion
export { Checkbox$1 as Checkbox };
