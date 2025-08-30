import React from "react";

const MessageHistory = ({ channelId, currentMessage }) => {
  const previewMessage = currentMessage || {
    title: "",
    body: "",
    attachments: [],
  };

  // Parse mentions in the message body for preview
  const parseMessageBody = (body) => {
    return body.replace(/<@(\d+)>/g, (match, userId) => {
      return `@user_${userId.slice(-4)}`;
    });
  };

  // Format message for Discord preview
  const formatForDiscord = (message) => {
    const parsedBody = parseMessageBody(message.body);
    return {
      ...message,
      body: parsedBody,
    };
  };

  const currentPreview = formatForDiscord(previewMessage);

  return (
    <div className="space-y-4">
      {/* Live Preview */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-white flex items-center space-x-2">
          <svg
            className="w-5 h-5 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          <span>Message Preview</span>
        </h3>

        {currentPreview.title || currentPreview.body ? (
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-600">
            {/* Discord-style message preview */}
            <div className="space-y-3">
              {/* Bot Info */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium">Discord Bot</span>
                    <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded">
                      BOT
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    Today at {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {/* Message Content */}
              <div className="bg-gray-900/50 rounded-lg p-4 border-l-4 border-blue-500">
                {currentPreview.title && (
                  <h4 className="text-xl font-bold text-white mb-2">
                    {currentPreview.title}
                  </h4>
                )}

                {currentPreview.body && (
                  <div className="text-gray-300 whitespace-pre-wrap mb-3">
                    {currentPreview.body}
                  </div>
                )}

                {/* Attachments Preview */}
                {currentPreview.attachments &&
                  currentPreview.attachments.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-gray-400">
                        Attachments:
                      </h5>
                      <div className="space-y-1">
                        {currentPreview.attachments.map((attachment, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 p-2 bg-gray-800 rounded border border-gray-600"
                          >
                            <svg
                              className="w-4 h-4 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                              />
                            </svg>
                            <span className="text-sm text-gray-300">
                              {attachment.name}
                            </span>
                            <span className="text-xs text-gray-400">
                              ({attachment.size} bytes)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Footer */}
                <div className="mt-4 pt-3 border-t border-gray-700">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Discord Message Embed</span>
                    <span>
                      Kurd Champions Gaming Community ©{" "}
                      {new Date().getFullYear()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800/30 rounded-xl p-8 border border-gray-600 border-dashed text-center">
            <div className="space-y-3">
              <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-400 mb-1">
                  Message Preview
                </h3>
                <p className="text-sm text-gray-500">
                  Start typing to see how your message will look
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Channel Info */}
      {channelId && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
              />
            </svg>
            <span className="text-blue-300 font-medium">
              Target Channel Selected
            </span>
          </div>
          <p className="text-blue-200 text-sm mt-1">
            Messages will be sent to the selected Discord channel
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
        <h4 className="text-purple-300 font-medium mb-2 flex items-center space-x-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>How to use mentions</span>
        </h4>
        <ul className="text-purple-200 text-sm space-y-1">
          <li>• Type @ followed by a username to search for users</li>
          <li>• Use arrow keys to navigate the user list</li>
          <li>• Press Enter or click to select a user</li>
          <li>• Mentions will appear as @username in Discord</li>
        </ul>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-400">0</div>
          <div className="text-green-300 text-sm">Messages Sent</div>
        </div>
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-orange-400">0</div>
          <div className="text-orange-300 text-sm">Active Channels</div>
        </div>
      </div>
    </div>
  );
};

export default MessageHistory;
