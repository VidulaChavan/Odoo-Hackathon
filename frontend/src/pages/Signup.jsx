import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        
        <h1 className="text-3xl font-bold text-center mb-6">
          Sign Up
        </h1>

        <form>

          <input
            type="text"
            placeholder="Enter Full Name"
            className="w-full border p-3 rounded-lg mb-4"
          />

          <input
            type="email"
            placeholder="Enter Email"
            className="w-full border p-3 rounded-lg mb-4"
          />

          <input
            type="password"
            placeholder="Enter Password"
            className="w-full border p-3 rounded-lg mb-6"
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700"
          >
            Create Account
          </button>

        </form>

        <p className="text-center mt-5">
          Already have an account?

          <Link
            to="/login"
            className="text-blue-600 ml-2"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}