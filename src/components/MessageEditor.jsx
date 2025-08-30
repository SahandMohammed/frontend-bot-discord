import React from "react";

const MessageEditor = ({ title, body, onTitleChange, onBodyChange }) => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <h3 className="text-xl font-semibold text-white mb-6">Message Content</h3>

      <div className="space-y-6">
        {/* Message Title */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Message Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Enter message title..."
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-white/10"
            maxLength={100}
          />
          <div className="mt-1 text-xs text-gray-400 text-right">
            {title.length}/100 characters
          </div>
        </div>

        {/* Message Body */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Message Body
          </label>
          <textarea
            value={body}
            onChange={(e) => onBodyChange(e.target.value)}
            placeholder="Enter your message content here..."
            rows={8}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-white/10 resize-vertical"
            maxLength={2000}
          />
          <div className="mt-1 text-xs text-gray-400 text-right">
            {body.length}/2000 characters
          </div>
        </div>

        {/* Message Tips */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-300 mb-2">
            💡 Pro Tips:
          </h4>
          <ul className="text-xs text-blue-200 space-y-1">
            <li>• Use **bold** and *italic* formatting</li>
            <li>• Mention users with @username</li>
            <li>• Add line breaks for better readability</li>
            <li>• Keep messages engaging and clear</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MessageEditor;
