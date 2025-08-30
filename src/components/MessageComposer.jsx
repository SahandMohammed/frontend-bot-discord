import React, { useState, useRef, useEffect } from "react";
import UserMentionSelector from "./UserMentionSelector";

const MessageComposer = ({
  onSendMessage,
  disabled,
  loading,
  currentMessage,
  onMessageChange,
}) => {
  const [title, setTitle] = useState(currentMessage?.title || "");
  const [body, setBody] = useState(currentMessage?.body || "");
  const [attachments, setAttachments] = useState(
    currentMessage?.attachments || []
  );
  const [showMentionSelector, setShowMentionSelector] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionPosition, setMentionPosition] = useState({ start: 0, end: 0 });

  const bodyTextareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Sync with parent state
  useEffect(() => {
    if (currentMessage) {
      setTitle(currentMessage.title || "");
      setBody(currentMessage.body || "");
      setAttachments(currentMessage.attachments || []);
    }
  }, [currentMessage]);

  // Notify parent of changes
  useEffect(() => {
    if (onMessageChange) {
      onMessageChange({ title, body, attachments });
    }
  }, [title, body, attachments, onMessageChange]);

  const handleBodyChange = (e) => {
    const value = e.target.value;
    const selectionStart = e.target.selectionStart;

    setBody(value);

    // Check for @ mentions
    const beforeCursor = value.substring(0, selectionStart);
    const mentionMatch = beforeCursor.match(/@(\w*)$/);

    if (mentionMatch) {
      const query = mentionMatch[1];
      const mentionStart = selectionStart - mentionMatch[0].length;

      setMentionQuery(query);
      setMentionPosition({ start: mentionStart, end: selectionStart });
      setShowMentionSelector(true);
    } else {
      setShowMentionSelector(false);
      setMentionQuery("");
    }
  };

  const handleMentionSelect = (user) => {
    const beforeMention = body.substring(0, mentionPosition.start);
    const afterMention = body.substring(mentionPosition.end);
    const mention = `<@${user.id}>`;

    const newBody = beforeMention + mention + afterMention;
    setBody(newBody);
    setShowMentionSelector(false);
    setMentionQuery("");

    // Focus back to textarea and set cursor position
    setTimeout(() => {
      if (bodyTextareaRef.current) {
        bodyTextareaRef.current.focus();
        const newCursorPos = mentionPosition.start + mention.length;
        bodyTextareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
    }));

    setAttachments((prev) => [...prev, ...newAttachments]);
    e.target.value = ""; // Reset file input
  };

  const removeAttachment = (attachmentId) => {
    setAttachments((prev) => prev.filter((att) => att.id !== attachmentId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !body.trim()) {
      return;
    }

    try {
      await onSendMessage({
        title: title.trim(),
        body: body.trim(),
        attachments: attachments.map((att) => ({
          name: att.name,
          size: att.size,
          type: att.type,
        })),
      });

      // Reset form
      setTitle("");
      setBody("");
      setAttachments([]);
      setShowMentionSelector(false);
      setMentionQuery("");

      // Reset parent state
      if (onMessageChange) {
        onMessageChange({ title: "", body: "", attachments: [] });
      }
    } catch {
      // Error is handled by parent component
    }
  };

  // Handle click outside to close mention selector
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMentionSelector && !event.target.closest(".mention-selector")) {
        setShowMentionSelector(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMentionSelector]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Message Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter message title..."
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={disabled}
          maxLength={256}
        />
        <div className="text-right text-xs text-gray-400 mt-1">
          {title.length}/256
        </div>
      </div>

      {/* Body Input with Mention Support */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Message Body *
        </label>
        <div className="relative">
          <textarea
            ref={bodyTextareaRef}
            value={body}
            onChange={handleBodyChange}
            placeholder="Type your message... Use @username to mention users"
            rows={8}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={disabled}
            maxLength={4000}
          />

          {/* Mention Selector */}
          {showMentionSelector && (
            <div className="mention-selector absolute z-50 mt-1 w-80 max-w-full">
              <UserMentionSelector
                query={mentionQuery}
                onSelect={handleMentionSelect}
                onClose={() => setShowMentionSelector(false)}
              />
            </div>
          )}
        </div>

        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>Tip: Type @ followed by username to mention users</span>
          <span>{body.length}/4000</span>
        </div>
      </div>

      {/* Attachments */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Attachments
        </label>

        {/* File Input */}
        <div className="mb-3">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-gray-300 transition-colors duration-200 disabled:opacity-50"
          >
            <svg
              className="w-5 h-5 mr-2"
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
            Add Files
          </button>
        </div>

        {/* Attachment List */}
        {attachments.length > 0 && (
          <div className="space-y-2 p-3 bg-white/5 rounded-lg border border-white/10">
            <h4 className="text-sm font-medium text-gray-300 mb-2">
              Selected Files ({attachments.length})
            </h4>
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between p-2 bg-white/10 rounded-lg"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    {attachment.type.startsWith("image/") ? (
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
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    ) : (
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
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">
                      {attachment.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatFileSize(attachment.size)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeAttachment(attachment.id)}
                  className="flex-shrink-0 ml-2 p-1 text-red-400 hover:text-red-300 transition-colors duration-200"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={disabled || !title.trim() || !body.trim() || loading}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Sending...</span>
            </>
          ) : (
            <>
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
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              <span>Send Message</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default MessageComposer;
