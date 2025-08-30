import React, { useState, useEffect } from "react";
import MessageComposer from "./MessageComposer";
import MessageHistory from "./MessageHistory";
import apiClient from "../utils/apiClient";

const Messaging = () => {
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentMessage, setCurrentMessage] = useState({
    title: "",
    body: "",
    attachments: [],
  });

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      setLoading(true);
      const data = await apiClient.get("/channels");
      setChannels(data);
    } catch (err) {
      setError("Failed to load channels: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (messageData) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const result = await apiClient.post("/send-message", {
        ...messageData,
        channelId: selectedChannel,
      });
      setSuccess("Message sent successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);

      return result;
    } catch (err) {
      setError("Failed to send message: " + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-4">
      <div className="mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Messaging</h1>
              <p className="text-gray-300">
                Send messages to Discord channels with mentions and attachments
              </p>
            </div>
          </div>

          {/* Channel Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Channel
            </label>
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            >
              <option value="">Select a channel...</option>
              {channels.map((channel) => (
                <option
                  key={channel.id}
                  value={channel.id}
                  className="bg-gray-800"
                >
                  #{channel.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-red-300">{error}</span>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-green-300">{success}</span>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Message Composer */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <svg
                  className="w-6 h-6 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <span>Compose Message</span>
              </h2>

              <MessageComposer
                onSendMessage={handleSendMessage}
                disabled={!selectedChannel || loading}
                loading={loading}
                currentMessage={currentMessage}
                onMessageChange={setCurrentMessage}
              />
            </div>
          </div>

          {/* Message Preview & History */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <svg
                  className="w-6 h-6 text-purple-400"
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
                <span>Preview & History</span>
              </h2>

              <MessageHistory
                channelId={selectedChannel}
                currentMessage={currentMessage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messaging;
