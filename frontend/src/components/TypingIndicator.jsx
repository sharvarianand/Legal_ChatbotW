import React from "react";

function TypingIndicator() {
  return (
    <div className="flex space-x-1 mt-2">
      <span className="h-2 w-2 bg-gray-500 rounded-full animate-pulse"></span>
      <span className="h-2 w-2 bg-gray-500 rounded-full animate-pulse delay-75"></span>
      <span className="h-2 w-2 bg-gray-500 rounded-full animate-pulse delay-150"></span>
    </div>
  );
}

export default TypingIndicator;
