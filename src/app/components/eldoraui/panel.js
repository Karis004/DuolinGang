import * as React from "react";

const Base = React.forwardRef(({ className, ...props }, ref) => (
    <div className="flex flex-col w-[85vw] max-w-[450px] h-[65vh] mb-5 border-2 border-black bg-white p-4 mt-2 transition-all shadow-[4px_4px_0_0_#000]"
        ref={ref}
        {...props}>
    </div>
));
Base.displayName = "Base";

const RedDiv = React.forwardRef(({ className, ...props }, ref) => (
    <div
        className={`relative pl-4 border-l-4 border-red-500 ${className}`}
        ref={ref}
        {...props}>
    </div>
));
RedDiv.displayName = "RedDiv";

const BlackDiv = React.forwardRef(({ className, ...props }, ref) => (
    <div
        className={`overflow-auto mb-2 p-[5px] bg-white rounded ${className}`}
        ref={ref}
        {...props}>
    </div>
));
BlackDiv.displayName = "BlackDiv";

const Panel = React.forwardRef(({ className, ...props }, ref) => (
    <div className="flex flex-col w-[85vw] max-w-[450px] h-[70vh] overflow-auto border-2 border-black bg-white py-4 px-4 transition-all shadow-[4px_4px_0_0_#000] hover:shadow-none"
        ref={ref}
        {...props}>
    </div>
));
Panel.displayName = "Panel";

export { Base, RedDiv, BlackDiv, Panel };  