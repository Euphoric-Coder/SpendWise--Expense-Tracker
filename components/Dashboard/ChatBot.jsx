import React, { useState } from "react";
import { Button } from "../ui/button";
import { AskFinora } from "@/utils/aiAdvisor";
import { MessageCircleMoreIcon } from "lucide-react";

const Chatbot = ({
  totalBudget,
  totalIncome,
  totalSpend,
  largestBudget,
  highestExpense,
  totalDebt,
  debtToIncomeRatio,
  budgetList,
  expenseList,
}) => {
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const toggleChatVisibility = () => {
    setIsChatVisible(!isChatVisible);
  };

  const handleSendMessage = async () => {
    if (chatInput.trim() === "") return;

    const newMessage = { user: "You", message: chatInput };
    setChatHistory((prev) => [...prev, newMessage]);

    const botReply = await AskFinora(
      chatInput,
      totalBudget,
      totalIncome,
      totalSpend,
      largestBudget,
      highestExpense,
      totalDebt,
      debtToIncomeRatio,
      budgetList,
      expenseList
    );

    setChatHistory((prev) => [...prev, { user: "Finora", message: botReply }]);
    setChatInput("");
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={toggleChatVisibility}
        className="relative flex items-center text-white font-semibold rounded-full px-6 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg hover:scale-105 hover:shadow-[0px_0px_20px_5px_rgba(255,0,255,0.5)] transition-all duration-300 dark:from-blue-700 dark:via-teal-700 dark:to-cyan-600"
      >
        <MessageCircleMoreIcon size={24} />
        <span className="ml-2">Ask Finora</span>
      </Button>

      {/* Chat Window */}
      {isChatVisible && (
        <div className="fixed bottom-5 right-6 w-96 bg-gradient-to-br from-gray-50 via-white to-gray-100 border border-gray-300 rounded-2xl shadow-2xl dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-850 dark:to-gray-800 dark:border-gray-700">
          {/* Chat Header */}
          <div className="p-4 flex justify-between items-center bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 text-white rounded-t-2xl shadow-md dark:from-blue-800 dark:via-teal-700 dark:to-cyan-600">
            <h2 className="text-lg font-bold">Finora Assistant</h2>
            <button
              onClick={toggleChatVisibility}
              className="text-white hover:text-gray-300"
            >
              ✕
            </button>
          </div>

          {/* Chat History */}
          <div className="p-4 h-72 overflow-y-scroll bg-gradient-to-b from-gray-100 via-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            {chatHistory.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400">
                Start a conversation with Finora!
              </p>
            ) : (
              chatHistory.map((chat, index) => (
                <div
                  key={index}
                  className={`mb-4 flex ${
                    chat.user === "You" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-3 rounded-lg shadow-lg ${
                      chat.user === "You"
                        ? "bg-gradient-to-r from-blue-400 to-blue-500 text-white"
                        : "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 dark:from-gray-700 dark:to-gray-800 dark:text-white"
                    }`}
                  >
                    <strong>{chat.user}:</strong> {chat.message}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 rounded-b-2xl dark:bg-gradient-to-r dark:from-gray-850 dark:via-gray-800 dark:to-gray-900">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type your message..."
              className="w-full px-4 py-3 mb-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
            <Button
              onClick={handleSendMessage}
              className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-lg py-3 shadow-lg hover:scale-105 hover:shadow-[0px_0px_20px_5px_rgba(255,0,255,0.5)] transition-all duration-300 dark:from-blue-700 dark:via-teal-700 dark:to-cyan-600"
            >
              Send
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
