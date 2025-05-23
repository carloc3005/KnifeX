import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 py-8 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto text-center">
                <p className="text-sm">&copy; 2025 KnifeX. All rights reserved.</p>
                <p className="text-sm mt-2">Designed for CS2 Trading Enthusiasts.</p>
                <div className="flex justify-center space-x-6 mt-4">
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                        <span className="sr-only">Facebook</span>
                        {/* Facebook Icon */}
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                        </svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                        <span className="sr-only">Twitter</span>
                        {/* Twitter Icon */}
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                        <span className="sr-only">Instagram</span>
                        {/* Instagram Icon */}
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 1.172.052 1.771.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.656.413 1.255.465 2.427.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.052 1.172-.218 1.771-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.656.247-1.255.413-2.427.465-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.172-.052-1.771-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.656-.413-1.255-.465-2.427-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.052-1.172.218-1.771.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.656-.247 1.255-.413 2.427-.465C9.416 2.175 9.796 2.163 12 2.163zm0 1.802c-3.116 0-3.473.011-4.69.067-1.067.048-1.597.21-2.05.383a3.102 3.102 0 00-1.153.748 3.102 3.102 0 00-.748 1.153c-.173.453-.335.983-.383 2.05-.056 1.217-.067 1.574-.067 4.69s.011 3.473.067 4.69c.048 1.067.21 1.597.383 2.05a3.102 3.102 0 00.748 1.153 3.102 3.102 0 001.153.748c.453.173.983.335 2.05.383 1.217.056 1.574.067 4.69.067s3.473-.011 4.69-.067c1.067-.048 1.597.21 2.05-.383a3.102 3.102 0 001.153-.748 3.102 3.102 0 00.748-1.153c.173-.453.335-.983.383-2.05.056-1.217.067-1.574.067-4.69s-.011-3.473-.067-4.69c-.048-1.067-.21-1.597-.383-2.05a3.102 3.102 0 00-.748-1.153 3.102 3.102 0 00-1.153-.748c-.453-.173-.983-.335-2.05-.383-1.217-.056-1.574-.067-4.69-.067zm0 3.091c-2.651 0-4.792 2.14-4.792 4.792s2.14 4.792 4.792 4.792 4.792-2.14 4.792-4.792-2.14-4.792-4.792-4.792zm0 7.782c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3zm4.965-7.825a1.2 1.2 0 110-2.4 1.2 1.2 0 010 2.4z" clipRule="evenodd" />
                        </svg>
                    </a>
                </div>
            </div>
        </footer>
    );
}
