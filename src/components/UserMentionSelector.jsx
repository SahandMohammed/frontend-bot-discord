import React, { useState, useEffect, useRef, useCallback } from "react";
import apiClient from "../utils/apiClient";

const UserMentionSelector = ({ query, onSelect, onClose }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectorRef = useRef(null);
  const loadingRef = useRef(false);

  const searchMembers = useCallback(
    async (searchQuery, pageNum = 1, reset = false) => {
      if (loadingRef.current) return;

      if (!searchQuery || searchQuery.length < 1) {
        if (reset) {
          setMembers([]);
          setHasMore(false);
          setTotal(0);
        }
        return;
      }

      try {
        loadingRef.current = true;
        setLoading(true);

        const data = await apiClient.get(
          `/members/search?query=${encodeURIComponent(searchQuery)}&page=${pageNum}&limit=10`
        );

        if (reset || pageNum === 1) {
          setMembers(data.members);
        } else {
          setMembers((prev) => [...prev, ...data.members]);
        }

        setHasMore(data.hasMore);
        setTotal(data.total);
        setPage(pageNum);

        if (reset) {
          setSelectedIndex(0);
        }
      } catch (error) {
        console.error("Error searching members:", error);
        if (reset) {
          setMembers([]);
          setHasMore(false);
          setTotal(0);
        }
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    },
    []
  );

  // Search when query changes
  useEffect(() => {
    setPage(1);
    searchMembers(query, 1, true);
  }, [query, searchMembers]);

  // Load more members when scrolling
  const loadMore = useCallback(() => {
    if (!loading && hasMore && !loadingRef.current) {
      searchMembers(query, page + 1, false);
    }
  }, [loading, hasMore, query, page, searchMembers]);

  // Handle scroll for pagination
  const handleScroll = useCallback(
    (e) => {
      const { scrollTop, scrollHeight, clientHeight } = e.target;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

      if (scrollPercentage > 0.8) {
        loadMore();
      }
    },
    [loadMore]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!members.length) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, members.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (members[selectedIndex]) {
            onSelect(members[selectedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [members, selectedIndex, onSelect, onClose]);

  // Auto-scroll to selected item
  useEffect(() => {
    if (selectorRef.current && members.length > 0) {
      const selectedElement = selectorRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [selectedIndex, members.length]);

  if (!query) {
    return null;
  }

  return (
    <div className="bg-gray-800 border border-gray-600 rounded-lg shadow-xl max-h-64 overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 border-b border-gray-600 bg-gray-750">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">
            {query ? `Search: "${query}"` : "Search users..."}
          </span>
          {total > 0 && (
            <span className="text-xs text-gray-400">
              {members.length} of {total}
            </span>
          )}
        </div>
      </div>

      {/* Results */}
      <div
        ref={selectorRef}
        className="max-h-48 overflow-y-auto"
        onScroll={handleScroll}
      >
        {loading && members.length === 0 ? (
          <div className="px-3 py-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              <svg
                className="animate-spin h-4 w-4 text-gray-400"
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
              <span className="text-sm text-gray-400">Searching...</span>
            </div>
          </div>
        ) : members.length === 0 && query ? (
          <div className="px-3 py-4 text-center">
            <div className="text-sm text-gray-400">
              No users found for "{query}"
            </div>
          </div>
        ) : (
          <>
            {members.map((member, index) => (
              <div
                key={member.id}
                className={`px-3 py-2 cursor-pointer transition-colors duration-150 ${
                  index === selectedIndex
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
                onClick={() => onSelect(member)}
              >
                <div className="flex items-center space-x-3">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <img
                      src={member.avatar}
                      alt={member.username}
                      className="w-6 h-6 rounded-full"
                      onError={(e) => {
                        e.target.src = `https://cdn.discordapp.com/embed/avatars/${
                          member.discriminator % 5
                        }.png`;
                      }}
                    />
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium truncate">
                        {member.displayName}
                      </span>
                      {member.displayName !== member.username && (
                        <span className="text-xs opacity-75 truncate">
                          @{member.username}
                        </span>
                      )}
                    </div>

                    {/* Roles */}
                    {member.roles && member.roles.length > 0 && (
                      <div className="flex items-center space-x-1 mt-1">
                        {member.roles.slice(0, 2).map((role) => (
                          <span
                            key={role.id}
                            className="text-xs px-1 py-0.5 rounded"
                            style={{
                              backgroundColor: role.color
                                ? `#${role.color
                                    .toString(16)
                                    .padStart(6, "0")}20`
                                : "rgba(255,255,255,0.1)",
                              color: role.color
                                ? `#${role.color.toString(16).padStart(6, "0")}`
                                : "currentColor",
                            }}
                          >
                            {role.name}
                          </span>
                        ))}
                        {member.roles.length > 2 && (
                          <span className="text-xs text-gray-400">
                            +{member.roles.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Loading more indicator */}
            {loading && members.length > 0 && (
              <div className="px-3 py-2 text-center border-t border-gray-600">
                <div className="flex items-center justify-center space-x-2">
                  <svg
                    className="animate-spin h-3 w-3 text-gray-400"
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
                  <span className="text-xs text-gray-400">Loading more...</span>
                </div>
              </div>
            )}

            {/* Has more indicator */}
            {!loading && hasMore && (
              <div className="px-3 py-2 text-center border-t border-gray-600">
                <button
                  onClick={loadMore}
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors duration-150"
                >
                  Load more users...
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t border-gray-600 bg-gray-750">
        <div className="text-xs text-gray-400">
          ↑↓ Navigate • Enter Select • Esc Close
        </div>
      </div>
    </div>
  );
};

export default UserMentionSelector;
