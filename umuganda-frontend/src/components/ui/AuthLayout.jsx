import React from 'react';
import { Outlet } from 'react-router-dom';
import rwandaFlag from '../../assets/rwanda_flag.png';

const AuthLayout = () => {
    return (
        <div className="min-h-screen w-full flex bg-gray-50 dark:bg-gray-900">
            {/* Left Side - Content/Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-12 xl:p-24 animate-fadeIn">
                <div className="w-full max-w-md">
                    {/* You might want to put a logo here */}
                    <div className='mb-10'>
                        <h1 className="text-2xl font-bold text-rwanda-blue tracking-tighter">UmugandaSys</h1>
                    </div>

                    <Outlet />
                </div>
            </div>

            {/* Right Side - Image/Banner */}
            <div className="hidden lg:flex w-1/2 relative bg-rwanda-blue overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-rwanda-blue/90 to-blue-900/90 z-10 mix-blend-multiply" />
                <img
                    src={rwandaFlag}
                    alt="Rwanda Flag"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="relative z-20 flex flex-col justify-center h-full p-20 text-white">
                    <div className="space-y-6 max-w-lg">
                        <h2 className="text-5xl font-bold leading-tight tracking-tight">
                            Building a better community together.
                        </h2>
                        <p className="text-lg text-yellow-100 leading-relaxed border-l-4 border-rwanda-yellow pl-4">
                            Join thousands of citizens participating in Umuganda to transform our neighborhoods and create lasting impact.
                        </p>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute bottom-0 right-0 p-20 opacity-10">
                        <svg width="400" height="400" viewBox="0 0 200 200">
                            <path fill="currentColor" d="M45.7,-76.3C58.9,-69.3,69.1,-58.1,76.5,-45.8C83.9,-33.5,88.5,-20.1,86.6,-7.1C84.7,5.9,76.3,18.5,67.6,30.3C58.9,42.1,49.9,53.1,38.8,61.7C27.7,70.3,14.5,76.5,0.7,75.4C-13.1,74.3,-27.1,65.9,-39.8,56.5C-52.5,47.1,-63.9,36.7,-71.4,24.1C-78.9,11.5,-82.5,-3.3,-78.9,-17.1C-75.3,-30.9,-64.5,-43.7,-52.6,-51.2C-40.7,-58.7,-27.7,-60.9,-15.1,-61.8C-2.5,-62.7,10.1,-62.3,22.7,-61.9" transform="translate(100 100)" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
