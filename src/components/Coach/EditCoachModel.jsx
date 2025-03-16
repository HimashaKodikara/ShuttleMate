import React from 'react';

const EditCoachModal = ({ 
    isOpen, 
    step, 
    formData, 
    handleChange, 
    handleSubmit, 
    toggleModal, 
    addTrainingArea, 
    removeTrainingArea, 
    handleTrainingAreaChange, 
    uploadError, 
    setStep 
}) => {
    if (!isOpen) return null;

    const handleNextStep = () => {
        console.log('Form Data:', formData);
        
        if (!formData.CoachPhoto?.trim() || 
            !formData.CoachName?.trim() || 
            !formData.Tel?.trim() || 
            !formData.TrainingType?.trim() || 
            !formData.Certifications?.trim()) {
            console.log('Validation failed');
            alert('Please fill in all required fields before proceeding.');
            return;
        }
        
        console.log('Moving to next step');
        setStep(2);
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
                <h2 className="mb-4 text-2xl font-bold text-center">Edit Coach</h2>
                <form onSubmit={handleSubmit}>
                    {step === 1 ? (
                        <>
                            <div className="mb-4">
                                <label className="block mb-2 font-semibold">Coach Photo</label>
                                <input
                                    type="file"
                                    name="CoachPhoto"
                            
                                    onChange={handleChange}
                                    accept="image/*"
                                
                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2 font-semibold">Coach Name</label>
                                <input
                                    type="text"
                                    name="CoachName"
                                    value={formData.CoachName}
                                    onChange={handleChange}
                                
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
                                    
                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2 font-semibold">Training Type</label>
                                <select
                                    name="TrainingType"
                                    value={formData.TrainingType}
                                    onChange={handleChange}
                                    
                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                >
                                    <option value="">Select Training Type</option>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Professional">Professional</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2 font-semibold">Certifications</label>
                                <textarea
                                    name="Certifications"
                                    value={formData.Certifications}
                                    onChange={handleChange}
                            
                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                    rows="4"
                                />
                            </div>

                            {uploadError && <p className="text-red-500">{uploadError}</p>}
                            <div className="flex justify-between">
                                <button type="button" onClick={toggleModal} className="px-4 py-2 text-white bg-gray-500 rounded">
                                    Cancel
                                </button>
                                <button type="button" onClick={handleNextStep} className="px-4 py-2 text-white bg-blue-500 rounded">
                                    Next
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <h3 className="mb-2 font-semibold">Training Areas</h3>
                            <div className="p-2 mb-4 overflow-y-scroll border border-gray-300 rounded max-h-96">
                                {formData.TrainingAreas.map((area, index) => (
                                    <div key={index} className="mb-4">
                                        <label className="block mb-2 font-semibold">Court Name</label>
                                        <input
                                            type="text"
                                            name="CourtName"
                                            value={area.CourtName}
                                            onChange={(e) => handleTrainingAreaChange(index, e)}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded"
                                        />
                                        <label className="block mb-2 font-semibold">Area</label>
                                        <input
                                            type="text"
                                            name="Area"
                                            value={area.Area}
                                            onChange={(e) => handleTrainingAreaChange(index, e)}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded"
                                        />
                                        <button type="button" onClick={() => removeTrainingArea(index)} className="mt-2 text-red-500">
                                            Remove Area
                                        </button>
                                    </div>
                                ))}
                                <button type="button" onClick={addTrainingArea} className="mb-4 text-blue-500">
                                    Add Training Area
                                </button>
                            </div>
                            <div className="flex justify-between">
                                <button type="button" onClick={() => setStep(1)} className="px-4 py-2 text-white bg-gray-500 rounded">
                                    Back
                                </button>
                                <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded">
                                    Update
                                </button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default EditCoachModal;
