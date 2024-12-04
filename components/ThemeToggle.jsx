"use client";
import React, { useState } from "react";
import { BsMoonFill, BsSunFill } from "react-icons/bs";

const themes = {
    light: "aqua",
    dark: "dark",
};

const ThemeToggle = () => {
    const [theme, setTheme] = useState(themes.light);
    const toogleTheme = () => {
        const newTheme = theme === themes.light ? themes.dark : themes.light;
        document.documentElement.setAttribute("data-theme", newTheme);
        setTheme(newTheme);
    };
    return (
        <button onClick={toogleTheme} className="btn btn-outline btn-sm">
            {theme === themes.light ? (
                <BsMoonFill className="h-4 w-4" />
            ) : (
                <BsSunFill className="h-4 w-4" />
            )}
        </button>
    );
};

export default ThemeToggle;
