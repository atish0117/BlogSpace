import { useNavigate } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <AlertCircle className="h-24 w-24 text-red-500" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Oops! Page Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="space-y-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-4"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Home className="w-5 h-5 mr-2" />
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
}