"use client";
import { generateChatResponse } from "@/utils/actions";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-hot-toast";

const Chat = () => {
    const [text, setText] = useState("");
    const [messages, setMessages] = useState([]);
    const formatText = (text) => {
        const formattedText = text
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/(^|\n)\* (.*?)(?=\n|$)/g, "<li>$2</li>");

        // Wrap any <li> items with <ul> tags
        return formattedText.includes("<li>")
            ? `<ul>${formattedText}</ul>`
            : formattedText;
    };
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
    const handleSubmit = (e) => {
        e.preventDefault();
        const query = { role: "user", parts: [{ text: text }] };
        mutate(text);
        setMessages((prev) => [...prev, query]);
        setText("");
    };
    return (
        <div className="min-h-[calc(100vh-6rem)] grid grid-rows-[1fr,auto]">
            <div>
                {messages.map(({ role, parts }, index) => {
                    const avatar = role === "user" ? "👤" : "🤖";
                    const bcg = role === "user" ? "bg-base-200" : "bg-base-100";
                    return (
                        <div
                            key={index}
                            className={` ${bcg} flex py-6 -mx-8 px-8
                text-xl leading-loose border-b border-base-300`}
                        >
                            <span className="mr-4">{avatar}</span>
                            <p
                                className="max-w-6xl"
                                dangerouslySetInnerHTML={{
                                    __html: formatText(parts[0].text),
                                }}
                            />
                        </div>
                    );
                })}
                {isPending && <span className="mt-1 loading"></span>}
            </div>
            <form
                onSubmit={handleSubmit}
                className="max-w-4xl pt-12 fixed bottom-10 left-1/2 -translate-x-1/2 w-full"
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
                        {isPending ? "Replying..." : "Ask Question"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Chat;
