import * as React from "react";

import { cn } from "../../lib/utils";

const Input = React.forwardRef(({ className, type, value, onChange, ...props }, ref) => {
    return (
        <input
            type={type}
            className={cn(
                "m-2.5 flex h-14 w-[min(50vw,300px)] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 border-2 border-black p-4 shadow-[4px_4px_0_0_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] dark:hover:shadow-none hover:shadow-none dark:border-white dark:bg-zinc-800 dark:shadow-[4px_4px_0_0_#fff]",
                className
            )}
            ref={ref}
            value={value}
            onChange={onChange}
            {...props}
        />
    );
});
Input.displayName = "Input";

export { Input };
export default Input;
