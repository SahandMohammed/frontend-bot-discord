import React, { useState, useRef, useEffect } from "react";
import Portal from "./Portal";

const EmojiSelector = ({ emojis, selectedEmoji, onEmojiSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        updateDropdownPosition();
      }
    };

    const handleResize = () => {
      if (isOpen) {
        updateDropdownPosition();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen]);

  const updateDropdownPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  const handleToggle = () => {
    if (!isOpen) {
      updateDropdownPosition();
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-200 mb-2">
        Reaction Emoji
      </label>
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          onClick={handleToggle}
          className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-left text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-white/10"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{selectedEmoji.unicode}</span>
              <span className="font-medium text-gray-200">
                {selectedEmoji.name}
              </span>
            </div>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </button>

        {isOpen && (
          <Portal>
            <div
              ref={dropdownRef}
              className="absolute bg-gray-800 border border-gray-600 rounded-lg shadow-xl shadow-black/50 max-h-64 overflow-auto backdrop-blur-sm z-[9999]"
              style={{
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
                width: `${dropdownPosition.width}px`,
              }}
            >
              <div className="p-2">
                <div className="grid grid-cols-5 gap-2">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji.id}
                      type="button"
                      onClick={() => {
                        onEmojiSelect(emoji);
                        setIsOpen(false);
                      }}
                      className={`p-3 rounded-lg hover:bg-gray-700 transition-colors duration-150 flex items-center justify-center text-2xl ${
                        selectedEmoji.id === emoji.id
                          ? "bg-blue-600 ring-2 ring-blue-400"
                          : "hover:bg-gray-600"
                      }`}
                      title={emoji.name}
                    >
                      {emoji.unicode}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Portal>
        )}
      </div>
      <p className="text-xs text-gray-400 mt-1">
        This emoji will be automatically added as a reaction to your message
      </p>
    </div>
  );
};

export default EmojiSelector;
