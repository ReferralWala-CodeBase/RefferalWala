import { useState } from "react";

const CtcRangeSlider = () => {
    const [minCtc, setMinCtc] = useState(0);
    const [maxCtc, setMaxCtc] = useState(100);

    const handleMinChange = (e) => {
        const value = Math.min(parseInt(e.target.value), maxCtc - 1);
        setMinCtc(value);
    };

    const handleMaxChange = (e) => {
        const value = Math.max(parseInt(e.target.value), minCtc + 1);
        setMaxCtc(value);
    };

    return (
        <div className="mb-5 border py-3 px-2 rounded-lg">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">CTC (in LPA)</h2>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span>0 LPA</span>
                <span>100 LPA</span>
            </div>

            <div className="relative w-full h-6">
                <div className="absolute top-1/2 transform -translate-y-1/2 h-2 bg-gray-200 rounded-lg w-full"></div>

                <div
                    className="absolute top-1/2 transform -translate-y-1/2 h-2 bg-blue-500 rounded-lg"
                    style={{
                        left: `${(minCtc / 100) * 100}%`,
                        width: `${((maxCtc - minCtc) / 100) * 100}%`,
                    }}
                ></div>

                <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={minCtc}
                    onChange={handleMinChange}
                    className="absolute w-full h-2 appearance-none bg-transparent pointer-events-auto z-20 cursor-pointer"
                    style={{ left: 0, position: "absolute" }}
                />

                <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={maxCtc}
                    onChange={handleMaxChange}
                    className="absolute w-full h-2 appearance-none bg-transparent pointer-events-auto z-30 cursor-pointer"
                    style={{ left: 0, position: "absolute" }}
                />

                <div
                    className="absolute text-sm bg-blue-500 text-white px-2 py-1 rounded-md"
                    style={{
                        left: `${(minCtc / 100) * 100}%`,
                        transform: "translateX(-50%)",
                        top: "-30px",
                    }}
                >
                    {minCtc} LPA
                </div>

                <div
                    className="absolute text-sm bg-blue-500 text-white px-2 py-1 rounded-md"
                    style={{
                        left: `${(maxCtc / 100) * 100}%`,
                        transform: "translateX(-50%)",
                        top: "-30px",
                    }}
                >
                    {maxCtc} LPA
                </div>
            </div>
        </div>
    );
};

export default CtcRangeSlider;