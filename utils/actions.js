"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeFormat from "rehype-format";
import rehypePrism from "@mapbox/rehype-prism";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import prisma from "./db";

const addCopyButtonAndLanguageLabel = () => {
    return (tree) => {
        visit(tree, "element", (node) => {
            if (node.tagName === "pre") {
                const codeElement = node.children.find(
                    (child) => child.tagName === "code"
                );
                let language = "plaintext";

                if (codeElement && codeElement.properties.className) {
                    const langClass = codeElement.properties.className.find(
                        (cls) => cls.startsWith("language-")
                    );
                    if (langClass) {
                        language = langClass.replace("language-", "");
                    }
                }

                node.children.unshift({
                    type: "element",
                    tagName: "div",
                    properties: { className: ["language-label"] },
                    children: [{ type: "text", value: language }],
                });

                node.children.push({
                    type: "element",
                    tagName: "button",
                    properties: { className: ["copy-button"], type: "button" },
                    children: [
                        {
                            type: "element",
                            tagName: "svg",
                            properties: {
                                xmlns: "http://www.w3.org/2000/svg",
                                fill: "none",
                                viewBox: "0 0 24 24",
                                strokeWidth: 1.5,
                                stroke: "currentColor",
                                className: ["icon"],
                            },
                            children: [
                                {
                                    type: "element",
                                    tagName: "path",
                                    properties: {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        d: "M8.25 15H6a2.25 2.25 0 01-2.25-2.25v-9A2.25 2.25 0 016 1.5h9A2.25 2.25 0 0117.25 3.75v2.25M15.75 8.25H18a2.25 2.25 0 012.25 2.25v9A2.25 2.25 0 0118 21.75h-9a2.25 2.25 0 01-2.25-2.25v-2.25m2.25 0a.75.75 0 01.75-.75h6a.75.75 0 01.75.75v3a.75.75 0 01-.75.75h-6a.75.75 0 01-.75-.75v-3z",
                                    },
                                    children: [],
                                },
                            ],
                        },
                    ],
                });
            }
        });
    };
};

export const generateChatResponse = async (chatMessages, prompt) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview",
        });
        const chat = model.startChat({
            history: chatMessages.filter((x) => x.parts.length > 0),
        });
        let result = await chat.sendMessage(prompt);

        const markdownText = result.response.text();
        const htmlcontent = await unified()
            .use(remarkParse)
            .use(remarkRehype, { allowDangerousHtml: true })
            .use(rehypeRaw)
            .use(rehypeFormat)
            .use(rehypePrism)
            .use(addCopyButtonAndLanguageLabel)
            .use(rehypeStringify)
            .process(markdownText)
            .then((output) => String(output));
        return htmlcontent;
    } catch (e) {
        console.error("Error", e);
        if (e.message.includes("Candidate was blocked due to SAFETY") || true) {
            try {
                const genAI = new GoogleGenerativeAI(
                    process.env.GEMINI_API_KEY
                );
                const model = genAI.getGenerativeModel({
                    model: "gemini-1.5-pro",
                });
                const chat = model.startChat({
                    history: chatMessages.filter((x) => x.parts.length > 0),
                });
                let result = await chat.sendMessage(prompt);

                const markdownText = result.response.text();

                const htmlcontent = await unified()
                    .use(remarkParse)
                    .use(remarkRehype, { allowDangerousHtml: true })
                    .use(rehypeRaw)
                    .use(rehypeFormat)
                    .use(rehypePrism)
                    .use(addCopyButtonAndLanguageLabel)
                    .use(rehypeStringify)
                    .process(markdownText)
                    .then((output) => String(output));

                return htmlcontent;
            } catch (e) {
                console.log(e);
                return null;
            }
        }
        return null;
    }
};

export const generateTourResponse = async ({ city, country, days }) => {
    if (days && days > 1) {
        try {
            const query = `You are a tour guide. Find a ${city} in this ${country}.
If ${city} in this ${country} exists, create a list of things families can do in this ${city},${country} and create a day by day plan for ${days} days. Make sure you provide stop list with bold names of places.
Once you have a list, create a ${days}-day tour. Include the activities that can be done as well. Add response like this :
{
  "tour": {
    "city": "${city}",
    "country": "${country}",
    "title": "title of the tour",
    "description": "description of the city and tour",
    "stops": ["short paragraph on the stops for day 1 ", "short paragraph on the stop for day 2","short paragraph on the stop for day 3"]
  }
}
If you can't find info on exact ${city}, or ${city} does not exist, or it's population is less than 1, or it is not located in the following ${country} return { "tour": null }, with no additional characters.`;
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-pro",
                temperature: 0,
            });
            const result = await model.generateContent(query);

            const tourData = JSON.parse(
                result.response
                    .text()
                    .replace(/```json|```/g, "")
                    .trim()
            );

            if (!tourData.tour) {
                return null;
            }
            return tourData.tour;
        } catch (error) {
            console.log(error);
            return null;
        }
    } else {
        try {
            const query = `You are a tour guide. Find a ${city} in this ${country}.
If ${city} in this ${country} exists, create a list of things families can do in this ${city},${country} and create a day by day plan for ${days} days. Make sure you provide stop list with bold names of places and with atleast 5 places if possible.
Once you have a list, create a ${days}-day tour. Include the activities that can be done as well. Add response like this :
{
  "tour": {
    "city": "${city}",
    "country": "${country}",
    "title": "title of the tour",
    "description": "description of the city and tour",
    "stops": ["short paragraph on the stops 1 ", "short paragraph on the stop 2","short paragraph on the stop 3"]
  }
}
If you can't find info on exact ${city}, or ${city} does not exist, or it's population is less than 1, or it is not located in the following ${country} return { "tour": null }, with no additional characters.`;
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-pro",
                temperature: 0,
            });
            const result = await model.generateContent(query);

            const tourData = JSON.parse(
                result.response
                    .text()
                    .replace(/```json|```/g, "")
                    .trim()
            );

            if (!tourData.tour) {
                return null;
            }
            return tourData.tour;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
};

export const getExistingTour = async ({ city, country }) => {
    const tourData = await prisma.tour.findUnique({
        where: {
            city_country: {
                city: city.trim(),
                country: country.trim(),
            },
        },
    });
    return tourData && tourData.jsonData
        ? JSON.parse(tourData?.jsonData)
        : null;
};

export const createNewTour = (tour) => {
    try {
        return prisma.tour.create({
            data: {
                city: tour.city.trim(),
                country: tour.country.trim(),
                jsonData: JSON.stringify(tour),
            },
        });
    } catch (e) {
        console.log(e);
        return null;
    }
};

export const getAllTours = async (searchTerm) => {
    if (!searchTerm) {
        const tours = await prisma.tour.findMany({
            orderBy: {
                city: "asc",
            },
        });
        return tours;
    }
    const tours = await prisma.tour.findMany({
        where: {
            OR: [
                {
                    city: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    country: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
            ],
        },
        orderBy: {
            city: "asc",
        },
    });

    return tours;
};

export const getSingleTour = async (id) => {
    const singletourData = await prisma.tour.findUnique({
        where: {
            id,
        },
    });
    return singletourData && singletourData.jsonData
        ? JSON.parse(singletourData?.jsonData)
        : null;
};
