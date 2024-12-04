import React from 'react';

interface IProps {
    children: React.ReactNode;
}

export default function Layout({ children }: IProps) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-200">
            <nav className="bg-gray-800 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex-shrink-0 text-purple-400 text-xl font-bold">
                            MyApp
                        </div>
                        {/* Navigation Links */}
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <a
                                    href="#profile"
                                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-purple-600 hover:text-white transition-all"
                                >
                                    Profile
                                </a>
                                <a
                                    href="#settings"
                                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-purple-600 hover:text-white transition-all"
                                >
                                    Settings
                                </a>
                                <a
                                    href="#pictures"
                                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-purple-600 hover:text-white transition-all"
                                >
                                    Pictures
                                </a>
                                <a
                                    href="#posts"
                                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-purple-600 hover:text-white transition-all"
                                >
                                    Posts
                                </a>
                                <a
                                    href="#about"
                                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-purple-600 hover:text-white transition-all"
                                >
                                    About
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="p-8">{children}</main>
        </div>
    );
}
