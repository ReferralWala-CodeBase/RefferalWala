import { useState } from "react";

const AboutMeSection = ({ profileData }) => {
    const [showFull, setShowFull] = useState(false);
    const aboutMeText = profileData?.aboutMe || "No about me information provided";

    return (
        <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">About Me</h3>
            <p className="text-sm text-gray-700 mb-2">
                {aboutMeText.length > 150 ? `${aboutMeText.substring(0, 150)}...` : aboutMeText} {aboutMeText.length > 150 && (
                    <button
                        onClick={() => setShowFull(true)}
                        className="text-blue-600 text-xs underline"
                    >
                        Show More
                    </button>
                )}
            </p>


            {showFull && (
                <div className="fixed z-40 inset-0 flex items-center justify-center bg-black/30 p-3">
                    <div className="bg-white p-4 rounded-lg shadow-lg max-w-lg w-full">
                        <h3 className="text-lg font-medium text-gray-800 mb-3">About Me</h3>
                        <p className="md:text-sm text-xs text-gray-700">{aboutMeText}</p>
                        <button
                            onClick={() => setShowFull(false)}
                            className="mt-2 text-xs text-white bg-blue-600 px-4 py-1 rounded-full"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AboutMeSection;
