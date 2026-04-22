import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Compass } from 'lucide-react';
import rwandaFlag from '../assets/rwanda_flag.png';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rwanda-blue rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rwanda-yellow rounded-full blur-[120px]" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-2xl">
                {/* Animated Icon Section */}
                <div className="mb-8 relative inline-block">
                    <div className="absolute inset-0 bg-rwanda-blue/10 rounded-full animate-ping scale-150 opacity-20" />
                    <div className="bg-white p-6 rounded-full shadow-2xl relative border border-gray-100">
                        <Compass className="w-20 h-20 text-rwanda-blue animate-pulse" />
                    </div>
                    <img
                        src={rwandaFlag}
                        alt="Rwanda Flag"
                        className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full border-4 border-white shadow-lg object-cover"
                    />
                </div>

                {/* Text Section */}
                <h1 className="text-9xl font-black text-gray-200 mb-2 tracking-tighter">404</h1>
                <h2 className="text-4xl font-bold text-gray-800 mb-4">
                    Icyerekezo ntabwo kigaragara
                </h2>
                <p className="text-lg text-gray-500 mb-10 max-w-md mx-auto leading-relaxed">
                    The page you are looking for doesn't exist or has been moved.
                    Let's get you back on track to your dashboard.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-2xl hover:border-rwanda-blue hover:text-rwanda-blue transition-all duration-300 shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Go Back
                        <span className="hidden lg:inline ml-1 opacity-50 text-sm font-normal">(-1)</span>
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-rwanda-blue text-white font-bold rounded-2xl hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-500/20 active:scale-95 transition-all duration-300"
                    >
                        <Home className="w-5 h-5" />
                        Back to Dashboard
                    </button>
                </div>
            </div>

            {/* Footer Branding */}
            <div className="mt-20 text-gray-400 text-sm font-medium tracking-widest uppercase flex items-center gap-2">
                <div className="w-8 h-[1px] bg-gray-200" />
                Umuganda System Plus
                <div className="w-8 h-[1px] bg-gray-200" />
            </div>
        </div>
    );
};

export default NotFound;
