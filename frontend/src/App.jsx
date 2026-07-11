// import React from "react";
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Home from './pages/Home';
// import Login from './pages/Login';
// import Signup from './pages/Signup';

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;


// import React from "react";

// function App() {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <h1 className="text-5xl font-bold text-red-600 underline">
//         Tailwind is Working!
//       </h1>
//     </div>
//   );
// }

// export default App;

// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";

// function Home() {
//   return <h1 className="text-4xl text-blue-600">🏠 Home Page</h1>;
// }

// function Login() {
//   return <h1 className="text-4xl text-green-600">🔐 Login Page</h1>;
// }

// function Signup() {
//   return <h1 className="text-4xl text-red-600">📝 Signup Page</h1>;
// }

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
// check the url 
// http://localhost:5173/login
// http://localhost:5173/signup
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;