import React from 'react';

const CoachersForm = ({ formData, setFormData, step, setStep, onSubmit }) => {
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (step === 1) {
            setStep(2);  // Move to Step 2
        } else {
            onSubmit(formData);  // Final submission
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {step === 1 ? (
                <>
                    <div className="mb-4">
                        <label className="block mb-2 font-semibold">Coach Name</label>
                        <input
                            type="text"
                            name="CoachName"
                            value={formData.CoachName}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-semibold">Tel</label>
                        <input
                            type="tel"
                            name="Tel"
                            value={formData.Tel}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-semibold">Coach Photo</label>
                        <input
                            type="file"
                            name="CoachPhoto"
                            onChange={handleChange}
                            accept="image/*"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="flex justify-between">
                        <button type="button" onClick={() => setStep(1)} className="px-4 py-2 text-white bg-gray-500 rounded">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded">
                            Next
                        </button>
                    </div>
                </>
            ) : (
                <>
                    {/* Step 2 form fields */}
                    <h3 className="mb-2 font-semibold">Training Areas</h3>
                    {/* Add inputs for training areas */}
                    <div className="flex justify-between">
                        <button type="button" onClick={() => setStep(1)} className="px-4 py-2 text-white bg-gray-500 rounded">
                            Back
                        </button>
                        <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded">
                            Submit
                        </button>
                    </div>
                </>
            )}
        </form>
    );
};

export default CoachersForm;
