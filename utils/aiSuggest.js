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

export const FinancialInsights = async (stats, month) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Analyze this financial data and provide 3 concise, actionable insights.
    Focus on spending patterns and practical advice.
    Keep it friendly and conversational.

    Financial Data for ${month}:
    - Total Income: $${stats.totalIncome}
    - Total Expenses: $${stats.totalExpenses}
    - Net Income: $${stats.totalIncome - stats.totalExpenses}
    - Expense Categories: ${Object.entries(stats.byCategory)
      .map(([category, amount]) => `${category}: $${amount}`)
      .join(", ")}

    Format the response as a JSON array of strings, like this:
    ["insight 1", "insight 2", "insight 3"]
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error generating insights:", error);
    return [
      "Your highest expense category this month might need attention.",
      "Consider setting up a budget for better financial management.",
      "Track your recurring expenses to identify potential savings.",
    ];
  }
}
