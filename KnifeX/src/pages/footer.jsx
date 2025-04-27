import React from 'react';

export default function footer() {
    return (
        <footer className="bg-gray-800 text-white py-4">
            <div className="container mx-auto text-center">
                <p>&copy; 2023 KnifeX. All rights reserved.</p>
                <p>Follow us on:</p>
                <div className="flex justify-center space-x-4 mt-2">
                    <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
                    <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
                    <a href="#" className="text-gray-400 hover:text-white">Instagram</a>
                </div>
            </div>
        </footer>
    );
}
