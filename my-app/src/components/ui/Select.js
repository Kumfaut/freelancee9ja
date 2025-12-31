"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { cn } from "./utils";

const Select = React.forwardRef((props, ref) => (
  <SelectPrimitive.Root ref={ref} {...props} />
));

const SelectGroup = React.forwardRef((props, ref) => (
  <SelectPrimitive.Group ref={ref} {...props} />
));

const SelectValue = React.forwardRef((props, ref) => (
  <SelectPrimitive.Value ref={ref} {...props} />
));

const SelectTrigger = React.forwardRef(({ className, size = "default", children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex w-full items-center justify-between gap-2 rounded-md border bg-input px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
      size === "sm" ? "h-8" : "h-9",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDownIcon className="w-4 h-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));

const SelectScrollUpButton = React.forwardRef((props, ref) => (
  <SelectPrimitive.ScrollUpButton ref={ref} className="flex items-center justify-center py-1" {...props}>
    <ChevronUpIcon className="w-4 h-4" />
  </SelectPrimitive.ScrollUpButton>
));

const SelectScrollDownButton = React.forwardRef((props, ref) => (
  <SelectPrimitive.ScrollDownButton ref={ref} className="flex items-center justify-center py-1" {...props}>
    <ChevronDownIcon className="w-4 h-4" />
  </SelectPrimitive.ScrollDownButton>
));

const SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "bg-popover text-popover-foreground relative z-50 max-h-[var(--radix-select-content-available-height)] min-w-[8rem] overflow-hidden rounded-md border shadow-md",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));

const SelectLabel = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Label ref={ref} className={cn("text-xs text-muted-foreground px-2 py-1.5", className)} {...props} />
));

const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute right-2 flex items-center justify-center w-4 h-4">
      <SelectPrimitive.ItemIndicator>
        <CheckIcon className="w-4 h-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));

const SelectSeparator = React.forwardRef((props, ref) => (
  <SelectPrimitive.Separator ref={ref} className="bg-border my-1 h-px -mx-1" {...props} />
));

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
