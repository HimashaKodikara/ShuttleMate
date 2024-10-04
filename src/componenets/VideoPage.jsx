import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import images from '../assets/Images/index.js';

const Home = () => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        videoName: '',
        videoCreator: '',
        videoFile: null,
        thumbnail: null
    });

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);  // handle form submission, e.g., send data to the backend
        setShowForm(false);  // hide form after submission
    };

    return (
        <div className='h-screen p-4 bg-slate-950'>
            <h1 className='pt-6 ml-16 font-serif text-2xl text-white'>Shuttlemate</h1>
            <h1 className='text-6xl font-bold text-center text-white'>Videos</h1>

            <div className="flex justify-end mb-6 mr-11">
                <button
                    className='justify-end px-5 py-2 text-2xl font-semibold transition duration-300 ease-in-out transform bg-yellow-500 text-slate-50 rounded-2xl hover:bg-yellow-600 hover:scale-105'
                    onClick={() => setShowForm(true)}
                >
                    Add New
                </button>
            </div>

            {/* Table */}
            <div className="mx-16 overflow-x-auto">
                <table className="min-w-full text-center rounded-lg shadow-lg table-auto bg-slate-800">
                    <thead className="text-white bg-blue-900">
                        <tr>
                            <th className="px-6 py-4">Name of Video</th>
                            <th className="px-6 py-4">Video By</th>
                            <th className="px-6 py-4">Edit</th>
                            <th className="px-6 py-4">Delete</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-300">
                        <tr className="transition duration-300 ease-in-out border-b bg-slate-900 border-slate-700 hover:bg-slate-800">
                            <td className="px-6 py-4">Smash Technique</td>
                            <td className="px-6 py-4">Coach John</td>
                            <td className="px-6 py-4">
                                <button className="px-4 py-2 font-bold text-white transition duration-300 ease-in-out transform bg-blue-500 rounded hover:bg-blue-600 hover:scale-105">
                                    Edit
                                </button>
                            </td>
                            <td className="px-6 py-4">
                                <button className="px-4 py-2 font-bold text-white transition duration-300 ease-in-out transform bg-red-500 rounded hover:bg-red-600 hover:scale-105">
                                    Delete
                                </button>
                            </td>
                        </tr>
                        <tr className="transition duration-300 ease-in-out border-b bg-slate-900 border-slate-700 hover:bg-slate-800">
                            <td className="px-6 py-4">Net Play Drills</td>
                            <td className="px-6 py-4">Coach Emma</td>
                            <td className="px-6 py-4">
                                <button className="px-4 py-2 font-bold text-white transition duration-300 ease-in-out transform bg-white rounded hover:scale-105">
                                    <img src={images.Edit} height={20} width={20} />
                                </button>
                            </td>
                            <td className="px-6 py-4">
                                <button className="px-4 py-2 font-bold text-white transition duration-300 ease-in-out transform bg-white rounded-full hover:scale-105">
                                    <img src={images.Bin} height={20} width={20} />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Form Popup */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-lg p-8 bg-white rounded-lg">
                        <h2 className="mb-6 text-2xl font-bold text-center">Add New Video</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block mb-2 font-semibold">Video Name</label>
                                <input
                                    type="text"
                                    name="videoName"
                                    value={formData.videoName}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2 font-semibold">Video Creator</label>
                                <input
                                    type="text"
                                    name="videoCreator"
                                    value={formData.videoCreator}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2 font-semibold">Video File</label>
                                <input
                                    type="file"
                                    name="videoFile"
                                    accept="video/*"
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2 font-semibold">Thumbnail</label>
                                <input
                                    type="file"
                                    name="thumbnail"
                                    accept="image/*"
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="px-4 py-2 mr-2 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                                >
                                    Submit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-2 font-bold text-white bg-red-500 rounded-lg hover:bg-red-600"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
