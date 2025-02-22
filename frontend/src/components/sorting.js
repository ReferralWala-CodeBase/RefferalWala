import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FaSortAmountDown, FaSortAmountUp, FaFilter } from "react-icons/fa";

export default function JobFilterDialog({ sortField, setSortField, sortOrder, setSortOrder, workModeFilter, setWorkModeFilter }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Button to Open Dialog */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1 md:py-2 text-xs sm:text-sm font-medium rounded-md shadow-sm border md:rounded-lg md:shadow-md hover:bg-gray-100 transition bg-gray-200 text-gray-700"
            >  
                <FaFilter className="text-md md:text-lg" /> Filter & Sort
            </button>

            {/* Dialog Box */}
            <Transition show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-30" />
                    </Transition.Child>

                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md bg-white p-6 rounded-lg shadow-xl">
                                <Dialog.Title className="text-lg font-semibold text-gray-700">Filter & Sort Jobs</Dialog.Title>

                                {/* Sorting Options */}
                                <div className="mt-4 space-y-4">
                                    {/* Sort By */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Sort By:</label>
                                        <select
                                            value={sortField}
                                            onChange={(e) => setSortField(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                        >
                                            <option value="appliedAt">Applied Date</option>
                                            <option value="companyName">Company Name</option>
                                            <option value="jobRole">Job Role</option>
                                            <option value="location">Location</option>
                                        </select>
                                    </div>

                                    {/* Sorting Order */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Sort Order:</label>
                                        <button
                                            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                                            className="w-full flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all"
                                        >
                                            {sortOrder === "asc" ? (
                                                <>
                                                    <FaSortAmountUp className="text-lg" /> Ascending
                                                </>
                                            ) : (
                                                <>
                                                    <FaSortAmountDown className="text-lg" /> Descending
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {/* Work Mode Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Work Mode:</label>
                                        <select
                                            value={workModeFilter}
                                            onChange={(e) => setWorkModeFilter(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                        >
                                            <option value="all">All</option>
                                            <option value="remote">Remote</option>
                                            <option value="onsite">Onsite</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Footer Buttons */}
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                                    >
                                        Close
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
