import { useState } from "react";
import { FaLocationArrow } from "react-icons/fa";
import { Dialog } from "@headlessui/react";

const Preferences = ({ preferences = [] }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPreference, setSelectedPreference] = useState(null);

    const openModal = (preference) => {
        setSelectedPreference(preference);
        setModalOpen(true);
    };

    return (
        <div className="w-full max-w-6xl mx-auto mt-3 relative">
            <h3 className="text-small font-semibold text-gray-900 mb-4">Projects</h3>
            <div className="space-y-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {preferences.length ? (
                    preferences.map((pref, index) => (
                        <div
                            key={index}
                            className="bg-white shadow-md rounded-xl p-4 border border-gray-200 hover:shadow-lg transition duration-300"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-14 h-14 bg-yellow-200 text-yellow-700 rounded-full flex items-center justify-center text-2xl">
                                    {pref.preferredCompanyURL ? (
                                        <img src={pref.preferredCompanyURL} alt="Company Logo" className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        <FaLocationArrow size={18} />
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-800">{pref.preferredCompanyName || "Preferred Company"}</h4>
                                    <p className="text-gray-500">{pref.preferredPosition || "Preferred Position"}</p>
                                </div>
                            </div>
                            <p className="mt-4 text-gray-600 text-sm">
                                <span className="font-medium">Expected CTC:</span> {pref.expectedCTCRange || "Not Set"}
                            </p>
                            {pref.description && pref.description.length > 20 ? (
                                <p className="text-gray-500 text-sm">
                                    {pref.description.slice(0, 20)}...
                                    <button
                                        onClick={() => openModal(pref)}
                                        className="text-blue-600 text-xs underline ml-1"
                                    >
                                        Show More
                                    </button>
                                </p>
                            ) : (
                                <p className="text-gray-500 text-sm">{pref.description}</p>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-sm">No preferences set.</p>
                )}
            </div>
            {/* Modal for full details */}
            <Dialog open={modalOpen} onClose={() => setModalOpen(false)} className="fixed bg-black/30 inset-0 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
                    <h4 className="text-lg font-semibold text-gray-800">{selectedPreference?.preferredCompanyName}</h4>
                    <p className="text-gray-600 mt-2">{selectedPreference?.description}</p>
                    <button
                        onClick={() => setModalOpen(false)}
                        className="mt-3 bg-gray-800 text-white px-4 py-1 text-sm rounded-full"
                    >
                        Close
                    </button>
                </div>
            </Dialog>
        </div>
    );
};

export default Preferences;