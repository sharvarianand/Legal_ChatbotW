import React from "react";

function Message({ sender, text }) {
  return (
    <div
      className={`p-2 my-1 rounded-md ${
        sender === "user" ? "bg-blue-500 text-white self-end" : "bg-gray-300"
      }`}
    >
      {text}
    </div>
  );
}

export default Message;
