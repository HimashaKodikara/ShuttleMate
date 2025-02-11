import React from 'react';

const CourtModal = ({ isOpen, formData, handleChange, handleSubmit, toggleModal, uploadError }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-center p-4 bg-black bg-opacity-50 witems-center ">
            <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
                <h2 className="mb-4 text-2xl font-bold text-center">Add New Court</h2>
                <form onSubmit={handleSubmit}>
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
                            name="Place"
                            value={formData.Place} 
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-semibold">Court Address</label>
                        <div className='flex flex-row'>
                        <div className=''>
                        <label>latitute</label>
                        <input
                            type="number"
                            name="latitute"
                            value={formData.latitute}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                        </div>
                        <div>
                        <label>lognitude</label>
                        <input
                            type="number"
                            name="lognitude"
                            value={formData.lognitude}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                        </div>
                        </div>
                    </div>

                    {uploadError && <p className="text-red-500">{uploadError}</p>}

                    <div className="flex justify-between">
                        <button type="button" onClick={toggleModal} className="px-4 py-2 text-white bg-gray-500 rounded">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CourtModal; 
