import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import DashboardContent from "./DashboardContent";

function Dashboard() {
  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <Header />
        <DashboardContent />
      </main>
    </div>
  );
}

export default Dashboard;