import React, { useState, useEffect } from "react";
import { AuthProvider } from "./contexts/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import TopBar from "./components/TopBar";
import Sidebar from "./components/Sidebar";
import DiscordBotController from "./components/DiscordBotController";
import Messaging from "./components/Messaging";

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("reaction-roles");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case "messaging":
        return "Discord Messaging";
      case "reaction-roles":
      default:
        return "Reaction Roles";
    }
  };

  // Update document title when active section changes
  useEffect(() => {
    let sectionTitle;
    switch (activeSection) {
      case "messaging":
        sectionTitle = "Discord Messaging";
        break;
      case "reaction-roles":
      default:
        sectionTitle = "Reaction Roles";
        break;
    }
    document.title = `${sectionTitle} - Kurd Champions Gaming Community`;
  }, [activeSection]);

  const renderContent = () => {
    switch (activeSection) {
      case "messaging":
        return <Messaging />;
      case "reaction-roles":
      default:
        return <DiscordBotController />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <TopBar
        onMenuClick={toggleSidebar}
        title={getSectionTitle()}
        sidebarOpen={sidebarOpen}
      />

      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        {/* Main Content */}
        <div
          className={`flex-1 transition-all duration-300 ease-in-out ${
            sidebarOpen ? "lg:ml-64" : "lg:ml-16"
          }`}
        >
          {/* Main Content Area */}
          <div className={activeSection === "messaging" ? "" : "p-4"}>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <AppContent />
      </ProtectedRoute>
    </AuthProvider>
  );
}

export default App;
