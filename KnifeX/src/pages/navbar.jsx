import React, { useState } from 'react'; 
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import knifexLogo from '../assets/images/knifex_logo.svg'; 

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isKnivesDropdownOpen, setIsKnivesDropdownOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const { user, logout, isAuthenticated } = useAuth();

    const knifeTypes = [
        "Flip Knife", "Gut Knife", "Huntsman Knife", "Karambit", "Kukri Knife",
        "M9 Bayonet", "Navaja Knife", "Nomad Knife", "Paracord Knife",
        "Shadow Daggers", "Skeleton Knife", "Stiletto Knife", "Survival Knife", "Talon Knife", "Ursus Knife"
    ];

    const handleLogout = () => {
        logout();
        setIsUserDropdownOpen(false);
        setIsMobileMenuOpen(false);
    };

    const getKnifeImagePath = (knifeType) => {
        let imageNamePrefix = knifeType.split(' ')[0].toLowerCase();
        let folderName = knifeType;
        let specificImageName = null;

        // Specific mappings for renamed folders or inconsistent naming
        if (knifeType === "Flip Knife") {
            imageNamePrefix = "flip";
        } else if (knifeType === "M9 Bayonet") {
            imageNamePrefix = "m9";
            folderName = "M9 Knife"; 
        } else if (knifeType === "Paracord Knife") {
            imageNamePrefix = "paracord";
        } else if (knifeType === "Shadow Daggers") {
            imageNamePrefix = "sd"; 
            folderName = "SD Knife";
            specificImageName = "shadowdaggers-vanilla.png"; 
        } else if (knifeType === "Kukri Knife") {
            imageNamePrefix = "kukri";
            specificImageName = "kukri-vailla.png";
        }

        const imageName = specificImageName || `${imageNamePrefix}-vanilla.png`;
        const relativeAssetPath = `../assets/knives/${folderName}/${imageName}`;

        try {
            const imageUrl = new URL(relativeAssetPath, import.meta.url).href;
            return imageUrl;
        } catch (error) {
            console.error(
                `Error constructing image URL for: ${knifeType}. \n` +
                `Attempted Path: ${relativeAssetPath}\n` +
                `Base URL (import.meta.url): ${import.meta.url}\n` +
                `Folder Name: ${folderName}, Image Name: ${imageName}\n` +
                `Error: ${error.message}`
            );
            return '/placeholder-knife-image.png'; 
        }
    };

    return (
        <nav className="bg-gray-800">
            <div className="mx-auto max-w-7xl px-0 sm:px-0 lg:px-0">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        {/* Mobile menu button*/}
                        <button
                            type="button"
                            className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-none focus:ring-inset"
                            aria-controls="mobile-menu"
                            aria-expanded={isMobileMenuOpen.toString()}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <span className="absolute -inset-0.5"></span>
                            <span className="sr-only">Open main menu</span>
                            <svg className={`${isMobileMenuOpen ? 'hidden' : 'block'} size-6`} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                            <svg className={`${isMobileMenuOpen ? 'block' : 'hidden'} size-6`} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex shrink-0 items-center">
                            <Link to="/">
                                <img className="h-8 w-auto" src={knifexLogo} alt="KnifeX Logo" />
                            </Link>
                        </div>
                        
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex items-center space-x-4">
                                <Link to="/" className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white" aria-current="page">Dashboard</Link>
                                
                                {/* Knives Dropdown - Desktop */}
                                <div
                                    className="relative flex items-center"
                                    onMouseEnter={() => setIsKnivesDropdownOpen(true)}
                                    onMouseLeave={() => setIsKnivesDropdownOpen(false)}
                                >
                                    <Link
                                        to="/knives"
                                        className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                                    >
                                        Knives
                                    </Link>
                                    {isKnivesDropdownOpen && (
                                        <div className="absolute left-0 top-full z-50 mt-1 w-80 bg-gray-900 border border-gray-700 rounded-md shadow-lg max-h-96 overflow-y-auto">
                                            <div className="grid grid-cols-2 gap-1 p-2">
                                                {knifeTypes.map((knifeType) => (
                                                    <Link
                                                        key={knifeType}
                                                        to={`/knives/${knifeType.toLowerCase().replace(/ /g, '-')}`}
                                                        className="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
                                                        onClick={() => setIsKnivesDropdownOpen(false)}
                                                    >
                                                        <img 
                                                            src={getKnifeImagePath(knifeType)} 
                                                            alt={`${knifeType} Vanilla`} 
                                                            className="h-4 w-auto mr-2" 
                                                        />
                                                        {knifeType}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {isAuthenticated && (
                                    <Link to="/my-knives" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                                        My Knives
                                    </Link>
                                )}
                                
                                <Link to="/about" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">About</Link>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Authentication UI */}
                    <div className="hidden sm:ml-6 sm:block">
                        <div className="flex items-center space-x-4">
                            {isAuthenticated ? (
                                <div className="relative">
                                    <button
                                        type="button"
                                        className="flex items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                        onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                    >
                                        <span className="sr-only">Open user menu</span>
                                        <div className="flex items-center space-x-2 px-3 py-2">
                                            <div className="h-8 w-8 rounded-full bg-sky-500 flex items-center justify-center">
                                                <span className="text-sm font-medium text-white">
                                                    {user?.username?.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <span className="text-sm font-medium text-white">{user?.username}</span>
                                            <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </button>
                                    
                                    {isUserDropdownOpen && (
                                        <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            <Link 
                                                to="/profile" 
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setIsUserDropdownOpen(false)}
                                            >
                                                Your Profile
                                            </Link>
                                            <Link 
                                                to="/trades" 
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setIsUserDropdownOpen(false)}
                                            >
                                                My Trades
                                            </Link>
                                            <button 
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Sign out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Link 
                                        to="/login" 
                                        className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                                    >
                                        Login
                                    </Link>
                                    <Link 
                                        to="/signup" 
                                        className="rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-700"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} sm:hidden`} id="mobile-menu">
                <div className="space-y-1 px-2 pb-3 pt-2">
                    <Link to="/" className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white" aria-current="page">Dashboard</Link>
                    
                    {/* Mobile Knives Dropdown */}
                    <div>
                        <button
                            className="flex w-full items-center justify-between rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                            onClick={() => setIsKnivesDropdownOpen(!isKnivesDropdownOpen)}
                        >
                            Knives
                            <svg className={`h-4 w-4 transform ${isKnivesDropdownOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                        {isKnivesDropdownOpen && (
                            <div className="mt-1 space-y-1 pl-5 pr-2 pb-2 bg-black">
                                {knifeTypes.map((knifeType) => (
                                    <Link
                                        key={knifeType}
                                        to={`/knives/${knifeType.toLowerCase().replace(/ /g, '-')}`}
                                        className="flex items-center rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                                        onClick={() => {
                                            setIsKnivesDropdownOpen(false);
                                            setIsMobileMenuOpen(false);
                                        }}
                                    >
                                        <img 
                                            src={getKnifeImagePath(knifeType)} 
                                            alt={`${knifeType} Vanilla`} 
                                            className="h-5 w-auto mr-3" 
                                        />
                                        {knifeType}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {isAuthenticated && (
                        <Link 
                            to="/my-knives" 
                            className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            My Knives
                        </Link>
                    )}
                    
                    <Link 
                        to="/about" 
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        About
                    </Link>

                    {/* Mobile Authentication */}
                    {isAuthenticated ? (
                        <div className="border-t border-gray-700 pt-4 mt-4">
                            <div className="flex items-center px-3 py-2">
                                <div className="h-8 w-8 rounded-full bg-sky-500 flex items-center justify-center">
                                    <span className="text-sm font-medium text-white">
                                        {user?.username?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="ml-3">
                                    <div className="text-base font-medium text-white">{user?.username}</div>
                                    <div className="text-sm font-medium text-gray-400">{user?.email}</div>
                                </div>
                            </div>
                            <Link 
                                to="/profile" 
                                className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Your Profile
                            </Link>
                            <Link 
                                to="/trades" 
                                className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                My Trades
                            </Link>
                            <button 
                                onClick={handleLogout}
                                className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                            >
                                Sign out
                            </button>
                        </div>
                    ) : (
                        <div className="border-t border-gray-700 pt-4 mt-4 space-y-1">
                            <Link 
                                to="/login" 
                                className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Login
                            </Link>
                            <Link 
                                to="/signup" 
                                className="block rounded-md bg-sky-600 px-3 py-2 text-base font-medium text-white hover:bg-sky-700"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
