import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";

// Initialize the Langchain ChatGroq client
const llm = new ChatGroq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  model: "llama-3.1-70b-versatile",
});
const GiveFinancialAdvice = async (
  totalBudget,
  totalIncome,
  totalSpend,
  largestBudget,
  largestExpense,
  debtAmount,
  debtToIncomeRatio
) => {
  try {
    // Define the prompt with comprehensive financial data
    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        "You are an expert financial advisor. Based on the provided financial data, provide comprehensive advice to help the user better manage their finances. Offer practical insights, prioritize reducing debt if applicable, and suggest areas for improvement.",
      ],
      [
        "human",
        `
Here is the user's financial data:
- Total Budget (Expected to spend not actually spending it): ${totalBudget} INR
- Total Income: ${totalIncome} INR
- Total Expenses (Amount spent): ${totalSpend} INR
- Largest Budget: ${largestBudget} INR
- Largest Expense: ${largestExpense} INR
- Debt Amount: ${debtAmount > 0 ? `${debtAmount} INR` : "No Debt"}
- Debt-to-Income Ratio: ${debtToIncomeRatio}

Please provide a short (in 10 lines) but comprehensive financial analysis in a concise format, including:
1. Financial health overview.
2. Key areas of concern or opportunities for improvement.
3. Suggested actions to optimize finances.
4. Advice on reducing debt if applicable.
5. Practical insights for budget management.
6. Recommendations for saving money and prioritizing spending.
[NOTE: ALSO ONLY RETURN THE ENTIRE CONTENT IN HTML FORMAT AND NOTHING ELSE ONLY THE CONTENT IN HTML (GIVING BOLD, ITALIC, HEADING, PARAGRAPH TAGS ETC AS REQUIRED AND BOLD THE TEXT, HEADING, ETC.)
ALSO DON'T ADD ** ** OR __ __ IN BETWEEN THE TEXT AS IT WILL CAUSE THE HTML TO BREAK.]
        `,
      ],
    ]);

    // Chain the prompt with the LLM
    const chain = prompt.pipe(llm);

    // Invoke the chain and get the advice
    const advice = await chain.invoke({});

    console.log("Generated Financial Advice:", advice.content);
    return advice.content;
  } catch (error) {
    console.error("Error fetching financial advice:", error);
    return "Sorry, I couldn't fetch the financial advice at this moment. Please try again later.";
  }
};

export default GiveFinancialAdvice;
