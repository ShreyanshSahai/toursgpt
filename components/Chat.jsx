"use client";
import { generateChatResponse } from "@/utils/actions";
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const Chat = () => {
    const [text, setText] = useState("");
    const [messages, setMessages] = useState([]);
    const { mutate, isPending } = useMutation({
        mutationFn: (query) => generateChatResponse(messages, query),
        onSuccess: (data) => {
            if (!data) {
                toast.error("Something went wrong");
                return;
            }
            const query = { role: "model", parts: [{ text: data }] };
            setMessages((prev) => [...prev, query]);
        },
    });

    useEffect(() => {
        const buttons = document.querySelectorAll(".copy-button");

        buttons.forEach((button) => {
            const handleClick = () => {
                const codeBlock = button.previousSibling;

                if (codeBlock) {
                    navigator.clipboard
                        .writeText(codeBlock.textContent)
                        .then(() => {
                            // Find the SVG inside the button
                            const svg = button.querySelector("svg");
                            if (svg) {
                                const path = svg.querySelector("path");

                                if (path) {
                                    // Change to tick icon (check)
                                    path.setAttribute("d", "M5 13l4 4L19 7");

                                    // Revert back to the copy icon after 2 seconds
                                    setTimeout(() => {
                                        path.setAttribute(
                                            "d",
                                            "M8.25 15H6a2.25 2.25 0 01-2.25-2.25v-9A2.25 2.25 0 016 1.5h9A2.25 2.25 0 0117.25 3.75v2.25M15.75 8.25H18a2.25 2.25 0 012.25 2.25v9A2.25 2.25 0 0118 21.75h-9a2.25 2.25 0 01-2.25-2.25v-2.25m2.25 0a.75.75 0 01.75-.75h6a.75.75 0 01.75.75v3a.75.75 0 01-.75.75h-6a.75.75 0 01-.75-.75v-3z"
                                        );
                                    }, 1500);
                                }
                            }
                        })
                        .catch((err) => {
                            console.error("Failed to copy text:", err);
                        });
                }
            };

            button.addEventListener("click", handleClick);

            // Cleanup
            return () => {
                button.removeEventListener("click", handleClick);
            };
        });
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const query = { role: "user", parts: [{ text: text }] };
        mutate(text);
        setMessages((prev) => [...prev, query]);
        setText("");
    };

    return (
        <div className="min-h-[calc(100vh-6rem)] grid grid-rows-[1fr,auto]">
            <div className="mb-10">
                {messages.map(({ role, parts }, index) => {
                    const isUser = role === "user";
                    const avatar = isUser ? "👤" : "🤖";
                    const alignment = isUser ? "justify-end" : "justify-start";
                    const messageAlignment = isUser
                        ? "bg-base-100"
                        : "bg-base-100";
                    const avatarAlignment = isUser
                        ? "order-last ml-4 mt-1"
                        : "mr-4 mt-1";

                    return (
                        <div key={index} className={`flex ${alignment} py-3`}>
                            <span className={`text-2xl ${avatarAlignment}`}>
                                {avatar}
                            </span>
                            <div
                                className={`max-w-5xl overflow-auto p-4 rounded-xl ${messageAlignment} shadow-md markdown-content`}
                                dangerouslySetInnerHTML={{
                                    __html: parts[0].text,
                                }}
                            />
                        </div>
                    );
                })}
                {isPending && <span className="mt-1 loading"></span>}
            </div>
            <form
                onSubmit={handleSubmit}
                className="max-w-2xl pt-12 fixed bottom-10 left-1/2 -translate-x-1/2 w-full"
            >
                <div className="join w-full">
                    <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="input input-bordered join-item w-full"
                        required
                        placeholder="Let's Converse..."
                        type="text"
                    />
                    <button
                        className="join-item btn btn-primary"
                        type="submit"
                        disabled={isPending}
                    >
                        {isPending ? "Replying..." : "Ask"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Chat;
