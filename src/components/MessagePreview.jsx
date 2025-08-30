import React from "react";

const MessagePreview = ({ title, body, emoji, channel }) => {
  const currentTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <h3 className="text-xl font-semibold text-white mb-6">Message Preview</h3>

      {/* Discord-like Message Preview */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
        {/* Channel Header */}
        <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-gray-600">
          <span className="text-gray-400 text-lg">#</span>
          <span className="text-white font-medium">{channel?.name || 'No channel selected'}</span>
          <span className="text-xs text-gray-500">
            ({channel?.type || 'text'} channel)
          </span>
        </div>

        {/* Bot Message */}
        <div className="space-y-3">
          {/* Bot Header */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">BOT</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-white font-semibold">
                Discord Reaction Bot
              </span>
              <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                BOT
              </span>
              <span className="text-xs text-gray-400">{currentTime}</span>
            </div>
          </div>

          {/* Message Content */}
          <div className="ml-13 space-y-2">
            {title && <h4 className="text-lg font-bold text-white">{title}</h4>}
            {body ? (
              <div className="text-gray-200 whitespace-pre-wrap leading-relaxed">
                {body}
              </div>
            ) : (
              <div className="text-gray-500 italic">
                No message content yet...
              </div>
            )}

            {/* Reaction Preview */}
            {(title || body) && (
              <div className="flex items-center space-x-2 mt-3 pt-2">
                <div className="flex items-center space-x-1 bg-gray-700 hover:bg-gray-600 rounded-md px-2 py-1 transition-colors cursor-pointer">
                  <span className="text-lg">{emoji.unicode}</span>
                  <span className="text-sm text-gray-300">1</span>
                </div>
                <span className="text-xs text-gray-500">
                  React with {emoji.unicode} to interact
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Info */}
      <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <div className="flex items-start space-x-2">
          <span className="text-yellow-400 mt-0.5">ℹ️</span>
          <div className="text-sm text-yellow-200">
            <p className="font-medium mb-1">Preview Information:</p>
            <ul className="text-xs space-y-1 text-yellow-100">
              <li>• This is how your message will appear in Discord</li>
              <li>
                • The bot will automatically add the {emoji.unicode} reaction
              </li>
              <li>• Message will be sent to #{channel?.name || 'selected channel'}</li>
              {!title && !body && (
                <li className="text-yellow-300">
                  • Fill in the message content to see the preview
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagePreview;
