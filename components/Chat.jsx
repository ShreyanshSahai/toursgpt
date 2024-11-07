"use client";
import { generateChatResponse } from "@/utils/actions";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
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
                        ? "order-last ml-4 mt-2"
                        : "mr-4";

                    return (
                        <div key={index} className={`flex ${alignment} py-3`}>
                            <span className={`text-2xl ${avatarAlignment}`}>
                                {avatar}
                            </span>
                            <div
                                className={`max-w-3xl p-4 rounded-xl ${messageAlignment} shadow-md`}
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
