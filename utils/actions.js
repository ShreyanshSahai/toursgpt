"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeHighlight from "rehype-highlight";

export const generateChatResponse = async (chatMessages, prompt) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const chat = model.startChat({
            history: chatMessages,
        });
        let result = await chat.sendMessage(prompt);
        const processor = unified()
            .use(remarkParse)
            .use(remarkRehype)
            .use(rehypeHighlight)
            .use(rehypeStringify);

        const htmlcontent = await processor.process(result.response.text());
        return htmlcontent.value;
    } catch (e) {
        console.error(e);

        return null;
    }
};

export const generateTourResponse = ({ city, country }) => {
    return null;
};

export const getExistingTour = ({ city, country }) => {
    return null;
};

export const createNewTour = (tour) => {
    return null;
};
