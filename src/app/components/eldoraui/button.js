import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90",
                destructive:
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline:
                    "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
                brutal:
                    "rounded-sm border-2 border-black bg-blue-500 px-8 py-4 text-white shadow-[4px_4px_0_0_#000] transition-all active:translate-x-[3px] active:translate-y-[3px] active:shadow-none dark:active:shadow-none dark:border-white dark:shadow-[4px_4px_0_0_#fff] hover:scale-105",
                "brutal-normal":
                    "rounded-sm border-2 border-black bg-white px-8 py-4 shadow-[4px_4px_0_0_#000] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none dark:hover:shadow-none dark:border-white dark:bg-zinc-800 dark:text-white dark:shadow-[4px_4px_0_0_#fff]",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 px-3",
                lg: "h-11 px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "icon",
            size: "lg",
        },
    }
);

const Button = React.forwardRef(
    ({ className, variant, size, asChild = false, href, onClick, ...props }, ref) => {
        const Comp = asChild ? Slot : href ? "a" : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                href={href}
                onClick={onClick}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export default Button;
export { buttonVariants };