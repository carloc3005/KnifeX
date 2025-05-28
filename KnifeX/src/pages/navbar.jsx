import React, { useState } from 'react'; // Import useState
import { Link } from 'react-router-dom';
import knifexLogo from '../assets/images/knifex_logo.svg'; // Import the logo

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isKnivesDropdownOpen, setIsKnivesDropdownOpen] = useState(false); // State for knives dropdown

    const knifeTypes = [
        "Filp Knife", "Gut Knife", "Huntsman Knife", "Karambit", "Kukri Knife",
        "M9 Bayonet", "Navaja Knife", "Nomad Knife", "Paracord Knift", "Shadow Daggers",
        "Skeleton Knife", "Stiletto Knife", "Survival Knife", "Talon Knife", "Ursus Knife"
    ];

    const getKnifeImagePath = (knifeType) => {
        let imageNamePrefix = knifeType.split(' ')[0].toLowerCase();
        let folderName = knifeType; // Default folder name to knifeType
        let specificImageName = null; // To override the default imagename if needed

        // Specific mappings for renamed folders or inconsistent naming
        if (knifeType === "Filp Knife") {
            imageNamePrefix = "flip";
            // folderName remains "Filp Knife"
        } else if (knifeType === "M9 Bayonet") {
            imageNamePrefix = "m9";
            folderName = "M9 Knife"; // Corrected folder name
        } else if (knifeType === "Paracord Knift") {
            imageNamePrefix = "paracord";
            // Assuming folder name is "Paracord Knift" as per knifeTypes array
            // If folder is "Paracord Knife", update folderName here
            folderName = "Paracord Knife"; // Corrected based on likely intention
        } else if (knifeType === "Shadow Daggers") {
            imageNamePrefix = "sd"; // Default prefix
            folderName = "SD Knife"; // Corrected folder name
            specificImageName = "shadowdaggers-vanilla.png"; // Specific filename
        } else if (knifeType === "Kukri Knife") {
            imageNamePrefix = "kukri";
            folderName = "Kukri Knife";
            specificImageName = "kukri-vailla.png"; // Specific filename with typo
        }

        const imageName = specificImageName || `${imageNamePrefix}-Vanilla.png`;
        const relativeAssetPath = `../assets/knives/${folderName}/${imageName}`;

        try {
            const imageUrl = new URL(relativeAssetPath, import.meta.url).href;
            return imageUrl;
        } catch (error) {
            console.error(`Failed to create URL for knife image: ${knifeType} (folder: ${folderName}, image: ${imageName}) with path ${relativeAssetPath}. Error: ${error.message}`);
            return ''; // Return an empty string or a placeholder path on error
        }
    };

    return (
        <nav className="bg-gray-800">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        {/* Mobile menu button*/}
                        <button
                            type="button"
                            className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset"
                            aria-controls="mobile-menu"
                            aria-expanded={isMobileMenuOpen.toString()}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <span className="absolute -inset-0.5"></span>
                            <span className="sr-only">Open main menu</span>
                            {/* Icon when menu is closed. */}
                            <svg className={`${isMobileMenuOpen ? 'hidden' : 'block'} size-6`} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                            {/* Icon when menu is open. */}
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
                            <div className="flex space-x-4">
                                <Link to="/" className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white" aria-current="page">Dashboard</Link>
                                {/* Knives Dropdown - Desktop */}
                                <div
                                    className="relative"
                                    onMouseEnter={() => setIsKnivesDropdownOpen(true)}
                                    onMouseLeave={() => setIsKnivesDropdownOpen(false)}
                                >
                                    <button className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none">
                                        Knives
                                    </button>
                                    {isKnivesDropdownOpen && (
                                        <div className="absolute z-10 mt-2 w-56 rounded-md bg-black shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"> {/* Adjusted width w-56 for image */}
                                            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                                {knifeTypes.map((knifeType) => (
                                                    <Link
                                                        key={knifeType}
                                                        to={`/knives/${knifeType.toLowerCase().replace(/ /g, '-')}`}
                                                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white" // Adjusted for flex layout
                                                        role="menuitem"
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
                                        </div>
                                    )}
                                </div>
                                <Link to="/about" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">About</Link>
                                <Link to="/trade" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Trade</Link>
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <button type="button" className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                            <span className="absolute -inset-1.5"></span>
                            <span className="sr-only">View notifications</span>
                            <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                            </svg>
                        </button>

                        {/* Login Link */}
                        <Link
                            to="/login"
                            className="ml-3 rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile menu, show/hide based on menu state. */}
            <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} sm:hidden`} id="mobile-menu">
                <div className="space-y-1 px-2 pt-2 pb-3">
                    <Link to="/" className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white" aria-current="page">Dashboard</Link>
                    {/* Knives Dropdown - Mobile */}
                    <div className="relative">
                        <button
                            onClick={() => setIsKnivesDropdownOpen(!isKnivesDropdownOpen)} // Consider toggling a separate state for mobile dropdown if needed
                            className="flex items-center w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none" // Added flex items-center
                        >
                            Knives
                            {/* Optional: Add a dropdown icon here if desired, e.g., a chevron */}
                        </button>
                        {isKnivesDropdownOpen && ( // This state is shared with desktop, might need separate state for mobile
                            <div className="mt-2 space-y-1 px-2 bg-black"> {/* Added bg-black */}
                                {knifeTypes.map((knifeType) => (
                                    <Link
                                        key={knifeType}
                                        to={`/knives/${knifeType.toLowerCase().replace(/ /g, '-')}`}
                                        className="flex items-center rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white" // Adjusted for flex layout
                                        onClick={() => {
                                            setIsKnivesDropdownOpen(false); // Close dropdown on click
                                            setIsMobileMenuOpen(false); // Close mobile menu on click
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
                    <Link to="/about" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">About</Link>
                    <Link to="/trade" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Trade</Link>
                    {/* Keep other mobile links if they exist, e.g., Team, Projects, Calendar if they are relevant to your app */}
                </div>
            </div>
        </nav>
    );
}