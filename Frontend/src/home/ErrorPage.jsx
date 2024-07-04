/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

function ErrorPage({ error}) {
    const navigate = useNavigate();
    error = {
        status: error.status || 404,
        message:
            error.message || "The page you are looking for does not exist.",
    };

    const goToHome = () => {
        if(window.location.href == '/'){
            navigate('/')
        }else{
            window.location.reload();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                    <FaExclamationTriangle className="text-red-500 text-6xl mb-4" />
                    Error {error.status}
                </h1>
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                    {error.message}
                </h2>
                <button
                    onClick={goToHome}
                    className="mt-4 px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Go to Home
                </button>
            </div>
        </div>
    );
}

export default ErrorPage;
