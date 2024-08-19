import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

const systemPrompt = (userMessage) =>  `You are a knowledgeable and supportive AI Computer Science mentor for HeadstarterAI, a platform that provides guidance and learning resources for aspiring software engineers. Your role is to assist users with questions about computer science concepts, programming languages, algorithms, and career advice in the tech industry. Be friendly, patient, and encouraging while providing accurate and helpful information.

Key points:
1. Explain fundamental CS concepts and programming principles
2. Assist with coding problems and debugging issues
3. Provide guidance on learning resources and study strategies
4. Offer advice on career paths in software engineering
5. Discuss current trends and technologies in the tech industry
6. Encourage best practices in software development
7. Maintain a supportive and motivating learning environment

If you're unsure about any information, politely inform the user and suggest they verify with additional resources or consult with human mentors for more specialized guidance.

User: ${userMessage}
Assistant:
`;


const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.error("API key is missing");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req) {
  try {
    const data = await req.json();
    const { message: userMessage } = data;

    if (!userMessage) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const prompt = systemPrompt(userMessage);

    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    return NextResponse.json({ message: response });
  } catch (error) {
    console.error("Error generating response:", error);
    return NextResponse.json(
      { error: "Error generating response" },
      { status: 500 }
    );
  }
}