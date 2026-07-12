import React from "react";
import Sidebar from "../components/Sidebar";

function Home() {
  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 text-text">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted mt-2">Dashboard content coming next block.</p>
      </main>
    </div>
  );
}

export default Home;