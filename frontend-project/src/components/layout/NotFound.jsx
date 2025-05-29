import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-6xl font-bold text-teal-600 mb-4">404</h1>
      <p className="text-2xl mb-8">Page Not Found</p>
      <p className="text-gray-600 mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/dashboard"
        className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-6 rounded-md transition duration-300"
      >
        Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
