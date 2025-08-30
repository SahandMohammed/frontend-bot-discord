import React from "react";

const Sidebar = ({
  isOpen,
  onToggle,
  activeSection = "dashboard",
  onSectionChange,
}) => {
  const menuItems = [
    {
      id: "reaction-roles",
      name: "Reaction Roles",
      icon: (
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
            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      id: "messaging",
      name: "Messaging",
      icon: (
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
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 h-full bg-white/10 backdrop-blur-md border-r border-white/20 z-50
        transition-all duration-300 ease-in-out
        ${isOpen ? "w-64" : "w-16"}
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <div
            className={`flex items-center ${
              isOpen ? "space-x-3" : ""
            } transition-all duration-200 ${
              isOpen
                ? "opacity-100 justify-start"
                : "hidden lg:flex lg:justify-center lg:w-full"
            }`}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
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
            {isOpen && (
              <span className="text-white font-semibold text-lg overflow-hidden whitespace-nowrap">
                Discord Bot
              </span>
            )}
          </div>

          {/* Toggle Button */}
          <button
            onClick={onToggle}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors duration-200 lg:hidden"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200
                    ${
                      activeSection === item.id
                        ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 text-white"
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                    }
                    ${!isOpen ? "justify-center" : ""}
                  `}
                >
                  <span
                    className={`flex-shrink-0 ${
                      activeSection === item.id ? "text-blue-400" : ""
                    }`}
                  >
                    {item.icon}
                  </span>
                  {isOpen && (
                    <span className="font-medium overflow-hidden whitespace-nowrap">
                      {item.name}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/20">
          <div
            className={`flex items-center ${
              isOpen ? "space-x-3" : ""
            } transition-all duration-200 ${
              isOpen
                ? "opacity-100 justify-start"
                : "hidden lg:flex lg:justify-center lg:w-full"
            }`}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            {isOpen && (
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="text-sm font-medium text-white truncate">
                  Bot Status
                </p>
                <p className="text-xs text-green-400">Online</p>
              </div>
            )}
          </div>

          {/* Collapse Button for Desktop */}
          <button
            onClick={onToggle}
            className={`
              hidden lg:flex w-full mt-3 items-center justify-center p-2 rounded-lg 
              bg-white/10 hover:bg-white/20 text-white transition-colors duration-200
              ${!isOpen ? "rotate-180" : ""}
            `}
          >
            <svg
              className="w-4 h-4 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
