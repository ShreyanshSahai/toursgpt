"use client";
import { useState } from "react";

const Chat = () => {
    const [text, setText] = useState("");
    const [message, setMessage] = useState([]);
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(text);
    };
    return (
        <div className="min-h-[calc(100vh-6rem)] grid grid-rows-[1fr,auto]">
            <div>
                <h2 className="text-5xl">Messages</h2>
            </div>
            <form onSubmit={handleSubmit} className="max-w-4xl pt-12">
                <div className="join w-full">
                    <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="input input-bordered join-item w-full"
                        required
                        placeholder="Message Me..."
                        type="text"
                    />
                    <button className="join-item btn btn-primary" type="submit">
                        Ask Me
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Chat;
