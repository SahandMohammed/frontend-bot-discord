import React, { useState, useEffect } from "react";
import ChannelSelector from "./ChannelSelector";
import MessageEditor from "./MessageEditor";
import MessagePreview from "./MessagePreview";
import EmojiSelector from "./EmojiSelector";

// API base URL (relative in production to avoid mixed-content)
const API_BASE_URL =
  import.meta.env.DEV && import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL
    : "/api";

// Default emojis (can be expanded later)
const defaultEmojis = [
  { id: "1", name: "👍", unicode: "👍" },
  { id: "2", name: "❤️", unicode: "❤️" },
  { id: "3", name: "😂", unicode: "😂" },
  { id: "4", name: "😮", unicode: "😮" },
  { id: "5", name: "😢", unicode: "😢" },
  { id: "6", name: "🎉", unicode: "🎉" },
  { id: "7", name: "🔥", unicode: "🔥" },
  { id: "8", name: "✅", unicode: "✅" },
  { id: "9", name: "❌", unicode: "❌" },
  { id: "10", name: "⭐", unicode: "⭐" },
];

const DiscordBotController = () => {
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [selectedLogChannel, setSelectedLogChannel] = useState(null);
  const [messageTitle, setMessageTitle] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState(defaultEmojis[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch channels from backend
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/channels`);
        if (response.ok) {
          const channelsData = await response.json();
          setChannels(channelsData);
          if (channelsData.length > 0) {
            setSelectedChannel(channelsData[0]);
            setSelectedLogChannel(channelsData[0]);
          }
        } else {
          throw new Error("Failed to fetch channels");
        }
      } catch (err) {
        console.error("Error fetching channels:", err);
        setError("Failed to load channels. Make sure the backend is running.");
      }
    };

    fetchChannels();
  }, []);

  const handleSendMessage = async () => {
    if (!messageTitle.trim() || !messageBody.trim()) {
      setError("Please fill in both title and message body");
      return;
    }

    if (!selectedChannel) {
      setError("Please select a message channel");
      return;
    }

    if (!selectedLogChannel) {
      setError("Please select a log channel");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${API_BASE_URL}/send-message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: messageTitle,
          description: messageBody,
          emoji: selectedEmoji.unicode,
          channelId: selectedChannel.id,
          logChannelId: selectedLogChannel.id,
          messageType: "reaction",
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(
          `Message sent to #${selectedChannel.name} with reaction ${selectedEmoji.unicode}. Logs will be sent to #${selectedLogChannel.name}`
        );
        // Reset form
        setMessageTitle("");
        setMessageBody("");
      } else {
        throw new Error(result.error || "Failed to send message");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError(err.message || "Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h2 className="text-2xl font-semibold text-white mb-4">
          Bot Configuration
        </h2>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <ChannelSelector
              channels={channels}
              selectedChannel={selectedChannel}
              onChannelSelect={setSelectedChannel}
              isLoading={channels.length === 0}
            />
          </div>
          <div>
            <ChannelSelector
              channels={channels}
              selectedChannel={selectedLogChannel}
              onChannelSelect={setSelectedLogChannel}
              isLoading={channels.length === 0}
            />
          </div>
          <div>
            <EmojiSelector
              emojis={defaultEmojis}
              selectedEmoji={selectedEmoji}
              onEmojiSelect={setSelectedEmoji}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Message Editor */}
        <div className="space-y-6">
          <MessageEditor
            title={messageTitle}
            body={messageBody}
            onTitleChange={setMessageTitle}
            onBodyChange={setMessageBody}
          />

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={
              isLoading ||
              !messageTitle.trim() ||
              !messageBody.trim() ||
              !selectedChannel ||
              !selectedLogChannel
            }
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Sending...</span>
              </div>
            ) : (
              "Send Message to Discord"
            )}
          </button>
        </div>

        {/* Message Preview */}
        <MessagePreview
          title={messageTitle}
          body={messageBody}
          emoji={selectedEmoji}
          channel={selectedChannel}
        />
      </div>
    </div>
  );
};

export default DiscordBotController;
