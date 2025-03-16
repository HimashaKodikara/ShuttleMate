import React from 'react';

const CourtModal = ({
    isOpen,
    formData,
    handleChange,
    handleDirectionsChange,
    handleSubmit,
    toggleModal,
    uploadError,
    addDirection,
    removeDirection,
    step,
    setStep,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
                <h2 className="mb-4 text-2xl font-bold text-center">Add New Court</h2>
                <form onSubmit={handleSubmit}>
                    {step === 1 ? (
                        <>
                            <div className="mb-4">
                                <label className="block mb-2 font-semibold">Court Name</label>
                                <input
                                    type="text"
                                    name="CourtName"
                                    value={formData.CourtName}
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
                                <label className="block mb-2 font-semibold">Place</label>
                                <input
                                    type="text"
                                    name="place"
                                    value={formData.place}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    onClick={toggleModal}
                                    className="px-4 py-2 text-white bg-gray-500 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="px-4 py-2 text-white bg-blue-500 rounded"
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="mb-4">
                                <label className="block mb-2 font-semibold">Court Photo</label>
                                <input
                                    type="file"
                                    name="CourtPhoto"
                                    onChange={handleChange}
                                    accept="image/*"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2 font-semibold">Court Address</label>
                                {formData.Directions.map((direction, index) => (
                                    <div key={index} className="flex flex-col gap-2 mb-4">
                                        <div className="flex gap-2">
                                            <div className="flex-1">
                                                <label>Latitude</label>
                                                <input
                                                    type="text"
                                                    name="latitude"
                                                    value={direction.latitude}
                                                    onChange={(e) => handleDirectionsChange(index, e)}
                                                    required
                                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label>Longitude</label>
                                                <input
                                                    type="text"
                                                    name="longitude"
                                                    value={direction.longitude}
                                                    onChange={(e) => handleDirectionsChange(index, e)}
                                                    required
                                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                                />
                                            </div>
                                        </div>
                                        {index > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => removeDirection(index)}
                                                className="px-2 py-1 text-white bg-red-500 rounded"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addDirection}
                                    className="px-4 py-2 text-white bg-green-500 rounded"
                                >
                                    Add Another Direction
                                </button>
                            </div>
                            {uploadError && <p className="text-red-500">{uploadError}</p>}
                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="px-4 py-2 text-white bg-gray-500 rounded"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-white bg-blue-500 rounded"
                                >
                                    Submit
                                </button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default CourtModal;