import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export const getSuggestions = async (incomeDescription, maxLength = 20) => {
  try {
    if (!incomeDescription.trim()) return [];

    const prompt = `Generate short business or freelance work names under ${maxLength} characters based on the description: "${incomeDescription}". Make it sound professional and and normal ones like Google SWE-II or Facebook PM (these are not real examples just a way to show how you can give).`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Process the response into valid suggestions
    const suggestedNames = responseText
      .split("\n")
      .map((name) => name.trim())
      .filter((name) => name.length > 0 && name.length <= maxLength)
      .slice(0, 5); // Limit to 5 suggestions

    return suggestedNames;
  } catch (error) {
    console.error("Error fetching AI suggestions:", error);
    return [];
  }
};
