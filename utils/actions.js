"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateChatResponse = async (chatMessages, prompt) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const chat = model.startChat({
            history: chatMessages,
        });
        let result = await chat.sendMessage(prompt);
        return result.response.text();
    } catch (e) {
        return null;
    }
};
