import React from "react";
import "../../styles/loaderstyles.css";
const Loader = () => {
    return (
        <div className="w-full h-screen flex items-center justify-center bg-white">
            <div className="relative w-32 h-32 flex items-center justify-center">
                {/* Outer Square */}
                <div className="absolute w-32 h-32 border-4 border-blue-500 rounded-md animate-spin-slow"></div>
                {/* Inner Square */}
                <div className="absolute w-16 h-16 border-4 border-blue-300 rounded-md animate-spin-reverse"></div>
            </div>
        </div>
    );
};

export default Loader;
