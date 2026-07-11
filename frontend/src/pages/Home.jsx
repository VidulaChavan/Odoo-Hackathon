import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
export default function Home() {
    const { user, token } = useAuth();
  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* Navbar */}
      <nav className="w-full bg-white shadow-md p-4 flex flex-row justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-600">
      </h1>

      {/* Login Button in the Right Corner */}
      <Link 
      to="/login" 
       className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded shadow transition-all duration-150"
      >
      Login
      </Link>
     </nav>

      {/* Hero Section */}
      
      </div>
      
  );
}