import * as React from "react";
import { cn } from "../../lib/utils";

const Table = React.forwardRef(({ className, ...props }, ref) => (
    <div className="flex flex-col w-[85vw] max-w-[450px] h-[70vh] overflow-auto border-2 border-black bg-white py-4 px-4 transition-all shadow-[4px_4px_0_0_#000] hover:shadow-none">
        <table
            ref={ref}
            className={cn("caption-bottom", className)}
            {...props}
        />
    </div>
));
Table.displayName = "Table";

const TableBody = React.forwardRef(({ className, ...props }, ref) => (
    <tbody
        ref={ref}
        className={cn("[&_tr:last-child]:border-0", className)}
        {...props}
    />
));
TableBody.displayName = "TableBody";

const TableRow = React.forwardRef(({ className, ...props }, ref) => (
    <tr
        ref={ref}
        className={cn(
            "bg-white-300 transition-all  hover:bg-gray-100",
            className
        )}
        {...props}
    />
));
TableRow.displayName = "TableRow";

const TableCell = React.forwardRef(({ className, ...props }, ref) => (
    <td
        ref={ref}
        className={cn("px-1 py-3 w-[35vw] align-middle", className)}
        {...props}
    />
));
TableCell.displayName = "TableCell";


export {
    Table,
    TableBody,
    TableRow,
    TableCell,
};
