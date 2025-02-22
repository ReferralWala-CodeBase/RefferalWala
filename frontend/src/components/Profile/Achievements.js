import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";

const Achievements = ({ achievements }) => {
    const [isOpen, setIsOpen] = useState(false);
    const visibleAchievements = achievements?.slice(0, 2);
    const hasMore = achievements?.length > 2;

    return (
        <div>
            <h3 className="mt-6 text-lg font-medium leading-7 text-gray-900">
                Achievements
            </h3>
            <div className="mt-3">
                {achievements?.length ? (
                    <ul className="text-gray-700 space-y-2 items-center">
                        {visibleAchievements.map((achievement, index) => (
                            <li key={index} className="text-xs font-normal rounded-full px-2 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-4 h-4 text-green-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                {achievement}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No achievements added</p>
                )}

                {hasMore && (
                    <button
                        onClick={() => setIsOpen(true)}
                        className="mt-2 text-blue-600 text-xs hover:underline-offset-2 hover:underline"
                    >
                        Show More
                    </button>
                )}
            </div>

            {isOpen && (
                <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <DialogPanel className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            All Achievements
                        </h3>
                        <ul className="list-disc list-inside text-gray-700">
                            {achievements.map((achievement, index) => (
                                <li key={index}>{achievement}</li>
                            ))}
                        </ul>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            Close
                        </button>
                    </DialogPanel>
                </Dialog>
            )}
        </div>
    );
};

export default Achievements;
