import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="mt-4 text-xl text-gray-600">Oops! The page you are looking for doesn’t exist.</p>

      <Link
        to="/"
        className="mt-6 px-6 py-3 bg-black text-white rounded-lg shadow hover:bg-gray-800 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
