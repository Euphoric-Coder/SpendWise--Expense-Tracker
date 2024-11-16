const { GoogleGenerativeAI } = require("@google/generative-ai");

export const formatNumber = (num) => {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
  }
  if (num >= 1e6) {
    return (num / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1e3) {
    return (num / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
};

// utils/getFinancialAdvice.js

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export const getFinancialAdvice = async (
  totalBudget,
  totalIncome,
  totalSpend
) => {
  console.log(totalBudget, totalIncome, totalSpend);
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const userPrompt = `
      Based on the following financial data:
      - Total Budget(Expected to spend not actually spending it): ${totalBudget} USD
      - Expenses: ${totalSpend} USD
      - Incomes: ${totalIncome} USD
      Provide detailed financial advice in 2 sentences to help the user manage their finances more effectively.
    `;

    const result = await model.generateContent(userPrompt);

    const advice = result.response.text(); // Extract the generated content

    console.log(advice);
    return advice;
  } catch (error) {
    console.error("Error fetching financial advice:", error);
    return "Sorry, I couldn't fetch the financial advice at this moment. Please try again later.";
  }
};

// export default {getFinancialAdvice, formatNumber};
