import React, { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { AskFinora } from "@/utils/aiAdvisor";
import { MessageCircleMoreIcon, SendIcon, Trash2 } from "lucide-react";

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
  const chatContainerRef = useRef(null);

  const toggleChatVisibility = () => {
    setIsChatVisible(!isChatVisible);
  };

  const handleSendMessage = async () => {
    if (chatInput.trim() === "") return;

    // Add user's message
    const newMessage = { user: "You", message: chatInput };
    setChatHistory((prev) => [...prev, newMessage]);

    // Clear input
    setChatInput("");

    // Simulate AI response
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
      expenseList,
      chatHistory
    );

    // Add AI's reply
    setChatHistory((prev) => [...prev, { user: "Finora", message: botReply }]);
  };

  // Smooth scrolling to the bottom when a new message is added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatHistory]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setChatHistory([]);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={toggleChatVisibility}
        className="relative flex items-center text-white font-semibold rounded-full px-6 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg hover:scale-110 hover:shadow-[0px_0px_25px_5px_rgba(255,0,255,0.6)] transition-transform duration-300 dark:from-blue-700 dark:via-teal-700 dark:to-cyan-600"
      >
        <MessageCircleMoreIcon size={24} />
        <span className="ml-2">Ask Finora</span>
      </Button>

      {/* Chat Window */}
      {isChatVisible && (
        <div className="fixed bottom-5 right-6 w-[380px] bg-gradient-to-br from-gray-50 via-white to-gray-100 border border-gray-300 rounded-2xl shadow-2xl dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-850 dark:to-gray-800 dark:border-gray-700">
          {/* Chat Header */}
          <div className="p-4 flex justify-between items-center bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 text-white rounded-t-2xl shadow-md dark:from-blue-800 dark:via-teal-700 dark:to-cyan-600">
            <div className="flex gap-3 items-center ">
              <h2 className="text-lg font-bold">Finora Assistant</h2>
              <Button
                onClick={clearChat}
                className="rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg hover:shadow-purple-400/50 hover:scale-110 transition-transform duration-300 dark:from-blue-500 dark:to-teal-400 text-white"
              >
                <Trash2 size={24} className="ml-2 text-white" /> Clear
              </Button>
            </div>
            <button
              onClick={toggleChatVisibility}
              className="text-white hover:text-gray-300 transition-transform duration-300 hover:scale-125"
            >
              ✕
            </button>
          </div>

          {/* Chat History */}
          <div
            ref={chatContainerRef}
            className="p-4 h-80 overflow-y-auto bg-gradient-to-b from-gray-100 via-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-b-lg scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-800"
          >
            {chatHistory.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400">
                Start a conversation with Finora!
              </p>
            ) : (
              chatHistory.map((chat, index) => (
                <div key={index} className="mb-4 flex">
                  <div
                    className={`relative max-w-[60%] w-fit px-4 py-2 rounded-lg ${
                      chat.user === "You"
                        ? "bg-gradient-to-r from-blue-400 to-blue-500 text-white ml-auto"
                        : "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 dark:from-gray-700 dark:to-gray-800 dark:text-white mr-auto"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{chat.message}</p>
                    {/* Bubble Tail */}
                    <div
                      className={`absolute w-3 h-3 ${
                        chat.user === "You"
                          ? "bg-blue-500 right-[-6px] bottom-2 rotate-45"
                          : "bg-gray-400 dark:bg-gray-800 left-[-6px] bottom-2 rotate-45"
                      } rounded-sm`}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-gradient-to-r from-gray-200 via-gray-250 to-gray-300 rounded-b-2xl shadow-md dark:bg-gradient-to-r dark:from-gray-700 dark:via-gray-800 dark:to-gray-900">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-grow px-4 py-3 text-sm rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
              <Button
                onClick={handleSendMessage}
                className="p-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:scale-110 hover:shadow-[0px_0px_25px_5px_rgba(255,0,255,0.6)] transition-transform duration-300 dark:from-blue-700 dark:via-teal-700 dark:to-cyan-600"
              >
                <SendIcon size={20} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
