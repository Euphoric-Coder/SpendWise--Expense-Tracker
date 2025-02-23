import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export const getSuggestions = async (incomeDescription, maxLength = 25) => {
  try {
    if (!incomeDescription.trim()) return [];

    const prompt = `
      Generate 5 simple and professional job or freelance titles under ${maxLength} characters based on the description: "${incomeDescription}". 
      Format the response strictly as a JSON array of job titles without any explanations or extra text.
      Example output: ["Software Engineer 2", "Freelance Developer (Upwork)", "Content Writer", "Marketing Consultant", "Data Analyst (Remote)"]
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Extract JSON array using regex
    const jsonMatch = responseText.match(/\[.*?\]/s); // Finds the first JSON array
    if (!jsonMatch) throw new Error("No valid JSON array found");

    const suggestedNames = JSON.parse(jsonMatch[0]);

    // Validate and filter suggestions
    return suggestedNames
      .filter((name) => typeof name === "string" && name.length <= maxLength)
      .slice(0, 5); // Ensure max 5 suggestions
  } catch (error) {
    console.error("Error fetching AI suggestions:", error);
    return [];
  }
};
