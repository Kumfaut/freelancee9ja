"use client";

import * as React from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { cn } from "./utils"; // optional if you want to merge classNames

const Collapsible = React.forwardRef((props, ref) => (
  <CollapsiblePrimitive.Root ref={ref} data-slot="collapsible" {...props} />
));

const CollapsibleTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <CollapsiblePrimitive.CollapsibleTrigger
    ref={ref}
    data-slot="collapsible-trigger"
    className={cn(className)}
    {...props}
  />
));

const CollapsibleContent = React.forwardRef(({ className, ...props }, ref) => (
  <CollapsiblePrimitive.CollapsibleContent
    ref={ref}
    data-slot="collapsible-content"
    className={cn(className)}
    {...props}
  />
));

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
