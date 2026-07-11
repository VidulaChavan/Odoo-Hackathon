import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-lg w-96">

        <h1 className="text-3xl font-bold text-center mb-6">
          Login
        </h1>

        <form>

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
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>

        </form>

        <p className="text-center mt-5">
          Don't have an account?

          <Link
            to="/signup"
            className="text-blue-600 ml-2"
          >
            Sign Up
          </Link>

        </p>

      </div>

    </div>
  );
}