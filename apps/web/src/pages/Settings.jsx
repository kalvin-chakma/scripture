import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Button from "../components/ui/button";
import ProfileSection from "../components/settings/ProfileSection";
import SecuritySection from "../components/settings/SecuritySection";
import SharedAccessSection from "../components/settings/SharedAccessSection";

const TABS = [
  { id: "profile", label: "Profile" },
  { id: "security", label: "Security" },
  { id: "shared", label: "Shared access" },
];

export default function Settings() {
  document.title = "Scripture | Settings";
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="flex h-full text-gray-800 no-scrollbar">
      <Sidebar />

      <div className="flex-1 px-6 py-6 max-w-3xl mx-auto overflow-y-auto no-scrollbar dark:text-gray-200">
        <h1 className="text-xl font-bold mb-1">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Manage your profile and note access.
        </p>

        <div className="flex gap-1 mb-6 border-b border-gray-200 dark:border-neutral-800">
          {TABS.map((tab) => (
            <Button
              key={tab.id}
              variant="unstyled"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 text-sm font-semibold border-b-2 -mb-px transition-colors duration-150 ${
                activeTab === tab.id
                  ? "border-gray-800 text-gray-900 dark:border-white dark:text-white"
                  : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {activeTab === "profile" && <ProfileSection />}
        {activeTab === "security" && <SecuritySection />}
        {activeTab === "shared" && <SharedAccessSection />}
      </div>
    </div>
  );
}
