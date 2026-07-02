import { cn } from "../../lib/utils.js";
import "react";
import { Label } from "radix-ui";
import { jsx } from "react/jsx-runtime";
//#region src/components/ui/label.tsx
function Label$1({ className, ...props }) {
	return /* @__PURE__ */ jsx(Label.Root, {
		"data-slot": "label",
		className: cn("flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50", className),
		...props
	});
}
//#endregion
export { Label$1 as Label };
