import React, { useState, useRef, useEffect } from "react";
import Portal from "./Portal";

const ChannelSelector = ({ channels, selectedChannel, onChannelSelect, isLoading = false }) => {
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
        Discord Channel
      </label>
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          onClick={handleToggle}
          disabled={isLoading || !selectedChannel}
          className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-left text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">#</span>
              <span className="font-medium">
                {isLoading ? "Loading channels..." : selectedChannel?.name || "No channel selected"}
              </span>
            </div>
            {isLoading ? (
              <svg className="w-5 h-5 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
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
            )}
          </div>
        </button>

        {isOpen && !isLoading && channels.length > 0 && (
          <Portal>
            <div
              ref={dropdownRef}
              className="absolute bg-gray-800 border border-gray-600 rounded-lg shadow-xl shadow-black/50 max-h-60 overflow-auto backdrop-blur-sm z-[9999]"
              style={{
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
                width: `${dropdownPosition.width}px`,
              }}
            >
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  type="button"
                  onClick={() => {
                    onChannelSelect(channel);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors duration-150 flex items-center space-x-2 ${
                    selectedChannel?.id === channel.id
                      ? "bg-blue-600 text-white"
                      : "text-gray-200"
                  }`}
                >
                  <span className="text-gray-400">#</span>
                  <span className="font-medium">{channel.name}</span>
                  <span className="text-xs text-gray-500 ml-auto">
                    {channel.type}
                  </span>
                </button>
              ))}
            </div>
          </Portal>
        )}
      </div>
    </div>
  );
};

export default ChannelSelector;
