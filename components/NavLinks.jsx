import Link from "next/link";
import React from "react";

const links = [
    { href: "/chat", label: "chat" },
    { href: "/tours", label: "tours" },
    { href: "/tours/new-tour", label: "new tour" },
    { href: "/profile", label: "profile" },
];

const NavLinks = () => {
    return (
        <ul className="menu text-base-content mt-3">
            {links.map((link) => {
                return (
                    <li key={link.href}>
                        <Link href={link.href} className="capitalize mr-3 my-1">
                            {link.label}
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
};

export default NavLinks;
