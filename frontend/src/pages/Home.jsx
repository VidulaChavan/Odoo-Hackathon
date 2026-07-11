import { useAuth } from "../context/AuthContext";
export default function Home() {
    const { user, token } = useAuth();
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4">
        <h1 className="text-2xl font-bold text-blue-600">
          Odoo Hackathon
        </h1>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center mt-32">
        <h1 className="text-5xl font-bold mb-4">
          Welcome to Odoo Hackathon
        </h1>

        <p className="text-gray-600 text-lg">
          React + Tailwind + React Router is working!
        </p>
        <div className="mt-8 p-4 bg-white rounded-lg shadow">
  <h2 className="text-xl font-bold mb-2">AuthContext Test</h2>

  <p>
    <strong>User:</strong>{" "}
    {user ? user.email : "Not Logged In"}
  </p>

  <p>
    <strong>Token:</strong>{" "}
    {token ? token : "No Token"}
  </p>
</div>
      </div>
    </div>
  );
}