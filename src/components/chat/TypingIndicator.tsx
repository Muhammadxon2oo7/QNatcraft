import React from "react";

const TypingIndicator: React.FC = () => (
  <div className="flex items-center space-x-1 p-2">
    <span className="text-gray-500 text-sm">Yozmoqda...</span>
    <span className="animate-bounce inline-block w-2 h-2 bg-gray-500 rounded-full"></span>
    <span className="animate-bounce inline-block w-2 h-2 bg-gray-500 rounded-full delay-100"></span>
    <span className="animate-bounce inline-block w-2 h-2 bg-gray-500 rounded-full delay-200"></span>
  </div>
);

export default TypingIndicator;