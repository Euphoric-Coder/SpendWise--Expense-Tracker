import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";

// Initialize the Langchain ChatGroq client
const llm = new ChatGroq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
});

export const GiveFinancialAdvice = async (
  totalBudget,
  totalIncome,
  totalSpend,
  largestBudget,
  highestExpense,
  totalDebt,
  debtToIncomeRatio,
  budgetList,
  expenseList
) => {
  try {
    // Budget Breakdown
    const budgetDetails = budgetList
      .map(
        (budget) =>
          `- ${budget.name}: Allocated Amount: ${budget.amount}, Total Spend: ${
            budget.totalSpend || 0
          }, Remaining: ${budget.amount - (budget.totalSpend || 0)}`
      )
      .join("\n");

    // Expense Breakdown
    const expenseDetails = expenseList.reduce((acc, expense) => {
      if (!acc[expense.budgetName]) {
        acc[expense.budgetName] = [];
      }
      acc[expense.budgetName].push(`  - ${expense.name}: ${expense.amount}`);
      return acc;
    }, {});

    // Generate Prompt
    const financialAdvicePrompt = `
### Comprehensive Financial Analysis ###

Please generate the following content as **HTML only** with no additional preamble or explanations. The output should be visually appealing and well-structured, adhering to the following guidelines:
- Use semantic HTML elements like \`<h1>\`, \`<h2>\`, \`<p>\`, and \`<ul>\` for proper structure.
- Include appropriate use of bold (\`<b>\`) and italic (\`<i>\`) text for emphasis where needed.
- Use bullet points (\`<ul>\` and \`<li>\`) for lists to improve readability.
- Add sections with distinct headers (\`<h2>\` or \`<h3>\`) for clarity.
- Ensure all numeric values are properly formatted (e.g., commas for thousands: 1,000,000).
- Incorporate spacing between sections using \`<br>\` or padding in a CSS-friendly manner.
- The HTML should be clean, minimalist, and professional.
- Use class="text-4xl font-bold" for h1 tags, class="text-3xl font-bold" for h2 tags, and class="text-2xl font-bold" for h3 tags.
- Use class="list-disc" for unordered list items and use unordered list only. 
- Don't add additional background color to the HTML.
- First of all add a heading "Comprehensive Financial Analysis" in the middle with text-3xl and font-bold.
[GIVE NICE FORMATTING FOR BETTER READABILITY & USE TAILWIND CSS CLASSES FOR STYLING THE HTML]

**Financial Health Overview:**
- Total Budget: ₹${totalBudget}
- Total Income: ₹${totalIncome}
- Total Spending: ₹${totalSpend}
- Largest Budget: ₹${largestBudget}
- Highest Expense: ₹${highestExpense}
- Total Debt: ₹${totalDebt}
- Debt-to-Income Ratio: ₹${debtToIncomeRatio}%

**Budget Breakdown:**
₹${budgetDetails}

**Expense Breakdown:**
₹${expenseDetails}

[The above detials are for you to give me insights and recommendations.]
[DO NOT WRITE THE ABOVE DETAILS FOR ME AGAIN! GIVE ME INSIGHTS ON THEM]

### Insights and Recommendations ###
1. **Budget Utilization:**
   - Analyze underutilized budgets and reallocate funds.
   - Ensure sufficient allocation for high-priority categories.

2. **Expense Optimization:**
   - Identify and reduce non-essential expenses.
   - Focus on aligning spending with budget goals.

3. **Debt Management:**
   - If applicable, create a repayment plan to reduce debt burden.
   - Maintain a low debt-to-income ratio for financial stability.

4. **Savings and Investments:**
   - Allocate ${
     totalIncome > totalSpend ? "surplus income" : "adjusted budget savings"
   } towards savings or investments.
   - Focus on long-term financial goals.

5. **Next Steps:**
   - Review and refine your budget.
   - Regularly monitor spending to stay on track.
   - Explore opportunities to increase income.

### Additional Notes ###
This analysis is based on the provided data. Regular updates to your financial data will improve accuracy and relevance.
`;



    // Define the prompt with comprehensive financial data
    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        "You are an expert financial advisor. Based on the provided financial data, provide comprehensive advice to help the user better manage their finances. Offer practical insights, prioritize reducing debt if applicable, and suggest areas for improvement.",
      ],
      ["human", financialAdvicePrompt],
    ]);

    // Chain the prompt with the LLM
    const chain = prompt.pipe(llm);

    // Invoke the chain and get the advice
    const advice = await chain.invoke({});

    // console.log("Generated Financial Advice:", advice.content);
    return advice.content;
  } catch (error) {
    console.error("Error fetching financial advice:", error);
    return "Sorry, I couldn't fetch the financial advice at this moment. Please try again later.";
  }
};

export const AskFinora = async (
  question,
  totalBudget,
  totalIncome,
  totalSpend,
  largestBudget,
  highestExpense,
  totalDebt,
  debtToIncomeRatio,
  budgetList,
  expenseList,
  chatHistory
) => {
  try {
    // Format chat history into a readable string
    const formattedChatHistory = chatHistory
      .map(
        (entry) =>
          `${entry.user === "You" ? "User" : "Finora"}: ${entry.message}`
      )
      .join("\n");

    // Define the prompt with financial data and chat history
    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are a professional financial advisor. Your role is to provide clear, concise, and accurate financial advice based on the user's question, the provided data, and the chat history. Avoid repeating the question and focus on actionable insights. Here is the context:

        - Total Budget: ${totalBudget}
        - Total Income: ${totalIncome}
        - Total Spend: ${totalSpend}
        - Largest Budget: ${largestBudget}
        - Highest Expense: ${highestExpense}
        - Total Debt: ${totalDebt}
        - Debt-to-Income Ratio: ${debtToIncomeRatio}
        - Budget List: ${budgetList}
        - Expense List: ${expenseList}

        Chat History:
        ${formattedChatHistory}

        Please generate the following content as **HTML only** with no additional preamble or explanations. The output should be visually appealing and well-structured, adhering to the following guidelines:
- Include appropriate use of bold (\`<b>\`) and italic (\`<i>\`) text for emphasis where needed.
- Use bullet points (\`<ul>\` and \`<li>\`) for lists to improve readability.
- Ensure all numeric values are properly formatted (e.g., commas for thousands: 1,000,000).
- Incorporate spacing between sections using \`<br>\` or padding in a CSS-friendly manner.
- The HTML should be clean, minimalist, and professional.
- Use class="text-4xl font-bold" for h1 tags, class="text-3xl font-bold" for h2 tags, and class="text-2xl font-bold" for h3 tags.
- Use class="list-disc" for unordered list items and use unordered list only. 
- Don't add additional background color to the HTML.
- First of all add a heading "Comprehensive Financial Analysis" in the middle with text-3xl and font-bold.
[GIVE NICE FORMATTING FOR BETTER READABILITY & USE TAILWIND CSS CLASSES FOR STYLING THE HTML]
        
        `,
      ],
      ["human", `User's Question: ${question}`],
    ]);

    // Chain the prompt with the LLM
    const chain = prompt.pipe(llm);

    // Invoke the chain and get the advice
    const advice = await chain.invoke({});

    // Return the generated advice
    return advice.content;
  } catch (error) {
    console.error("Error fetching financial advice:", error);
    return "Sorry, I couldn't fetch the financial advice at this moment. Please try again later.";
  }
};

