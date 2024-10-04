import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/firebaseconfig'; // Import Firebase storage

const Home = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
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

    // Function to upload file to Firebase Storage
    const uploadFile = (file, folder) => {
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
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL); // Return the download URL
                    });
                }
            );
        });
    };

    // Handle form submission and upload files
    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true); // Start uploading state

        try {
            // Upload video and image to Firebase Storage
            const videoURL = await uploadFile(formData.videoFile, 'videos');
            const thumbnailURL = await uploadFile(formData.thumbnail, 'thumbnails');

            console.log('Video URL:', videoURL);
            console.log('Thumbnail URL:', thumbnailURL);

            // Store the URLs and other data in your database (optional)
            // You can use Firestore or any other database to save the video details.

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
                                    required
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

export default Home;
