import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";

const HoverInfo = ({ data }) => {
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const buttonRef = useRef(null);

  const showPopover = () => {
    setIsPopoverVisible(true);
  };

  const hidePopover = () => {
    setIsPopoverVisible(false);
  };

  const getPopoverPosition = () => {
    if (!buttonRef.current) return { top: 0, left: 0 };
    const rect = buttonRef.current.getBoundingClientRect();
    return {
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    };
  };

  const position = getPopoverPosition();

  return (
    <div className="relative inline-block">
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        onMouseEnter={showPopover}
        onMouseLeave={hidePopover}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <svg
          className="w-4 h-4 text-white hover:text-gray-500"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          ></path>
        </svg>
        <span className="sr-only">Show information</span>
      </button>

      {/* Popover */}
      {isPopoverVisible &&
        createPortal(
          <div
            onMouseEnter={showPopover} // Keep visible when hovering on the popover
            onMouseLeave={hidePopover} // Hide when leaving the popover
            className="absolute z-50 p-3 w-80 text-sm text-gray-500 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 transition-opacity duration-200"
            style={{
              position: "absolute",
              top: position.top,
              left: position.left,
            }}
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              {data.title}
            </h3>
            <div>{data.description}</div>
          </div>,
          document.body // Render popover at the root level
        )}
    </div>
  );
};

export default HoverInfo;
