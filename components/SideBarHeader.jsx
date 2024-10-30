import React from "react";
import { SiOpenaigym } from "react-icons/si";
import ThemeToggle from "./ThemeToggle";

const SideBarHeader = () => {
    return (
        <div className="flex items-center mb-4 gap-4 px-4">
            <SiOpenaigym className="w-10 h-10 text-primary" />
            <h2 className="text-2xl font-extrabold text-primary">Tours GPT</h2>
            <ThemeToggle />
        </div>
    );
};

export default SideBarHeader;
