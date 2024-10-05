import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/firebaseconfig'; // Import Firebase storage
import images from '../assets/Images';
import axios from 'axios';

const VideoPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [input, setinput] = useState({});
    const [formData, setFormData] = useState({
        videoName: '',
        videoCreator: '',
        videoFile: null,
        thumbnail: null,
    });

    const [uploading, setUploading] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData({
                ...formData,
                [name]: files[0], // Store the file if available
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const uploadFile = (file, folder, filetype) => {
        return new Promise((resolve, reject) => {
            const storageRef = ref(storage, `${folder}/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);
    
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                },
                (error) => {
                    reject(error);
                },
                () => {
                    // Get the download URL when the upload is completed
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then((downloadURL) => {
                            console.log('DownloadURL - ', downloadURL);
                            setinput((prev) => ({
                                ...prev,
                                [filetype]: downloadURL,
                            }));
                            resolve(downloadURL);  // Resolve with the download URL
                        })
                        .catch((error) => reject(error));  // Reject on error
                }
            );
        });
    };
    
    // Handle form submission and upload files
    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
    
        try {
            // Upload video and thumbnail to Firebase Storage
            const videoURL = await uploadFile(formData.videoFile, 'videos', 'videoFile');
            const thumbnailURL = await uploadFile(formData.thumbnail, 'thumbnails', 'thumbnail');
    
            console.log('Video URL:', videoURL);
            console.log('Thumbnail URL:', thumbnailURL);
    
            // Post the data to the backend
            await axios.post(`http://localhost:5000/api/videos`, { ...input });
    
            // Reset form and close modal
            setFormData({
                videoName: '',
                videoCreator: '',
                videoFile: null,
                thumbnail: null,
            });
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error uploading files:', error);
        } finally {
            setUploading(false); // End uploading state
        }
    };
    

    return (
        <div className='h-screen p-4 bg-slate-950'>
            <h1 className='pt-6 ml-16 font-serif text-2xl text-white'>Shuttlemate</h1>
            <h1 className='text-6xl font-bold text-center text-white'>Videos</h1>

            <div className="flex justify-end mb-6 mr-11">
                <button
                    onClick={toggleModal}
                    className='justify-end px-5 py-2 text-3xl font-semibold transition duration-300 ease-in-out transform bg-yellow-500 text-slate-50 rounded-2xl hover:bg-yellow-600 hover:scale-105'
                >
                    Add New
                </button>
                </div>
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
                                    <button className="px-4 py-2 font-bold text-white transition duration-300 ease-in-out transform bg-white rounded hover:bg-white hover:scale-105">
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

                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-auto bg-black bg-opacity-50">
                        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
                            <h2 className="mb-4 text-2xl font-bold text-center">Add New Video</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block mb-2 text-lg font-medium">Video Name</label>
                                    <input
                                        type="text"
                                        name="videoName"
                                        value={formData.videoName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-2 text-lg font-medium">Video Creator</label>
                                    <input
                                        type="text"
                                        name="videoCreator"
                                        value={formData.videoCreator}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-2 text-lg font-medium">Upload Video</label>
                                    <input
                                        type="file"
                                        name="videoFile"
                                        accept="video/*"
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-2 text-lg font-medium">Thumbnail</label>
                                    <input
                                        type="file"
                                        name="thumbnail"
                                        accept="image/*"
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={toggleModal}
                                        className="px-4 py-2 mr-4 font-bold text-white bg-red-500 rounded hover:bg-red-600"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={uploading}
                                        className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600"
                                    >
                                        {uploading ? 'Uploading...' : 'Save'}
                                    </button>
                                    
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
            );
};

            export default VideoPage;
