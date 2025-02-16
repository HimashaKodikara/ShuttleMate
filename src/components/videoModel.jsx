// VideoModal.js
import React, { useState } from 'react';
import { uploadFile } from './uploadUtils'; // Assume we have this helper for file upload logic
import axios from 'axios';

const VideoModal = ({ isModalOpen, toggleModal, fetchVideos }) => {
    const [formData, setFormData] = useState({
        videoName: '',
        videoCreator: '',
        videoFile: null,
        thumbnail: null,
    });
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        setUploadError('');

        try {
            if (!formData.videoFile || !formData.thumbnail) {
                setUploadError('Please upload both video and thumbnail.');
                return;
            }

            const videoURL = await uploadFile(formData.videoFile, 'videos');
            const thumbnailURL = await uploadFile(formData.thumbnail, 'thumbnails');

            const response = await axios.post(`http://localhost:5000/api/videos/`, {
                videoUrl: videoURL,
                imgUrl: thumbnailURL,
                videoName: formData.videoName,
                videoCreator: formData.videoCreator,
            });

            setFormData({ videoName: '', videoCreator: '', videoFile: null, thumbnail: null });
            fetchVideos(); // Refresh the video list after upload
            toggleModal(); // Close modal
        } catch (error) {
            console.error('Error uploading or saving video:', error);
            setUploadError('An error occurred while saving the video. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        isModalOpen && (
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
                        {uploadError && (
                            <div className="mb-4 text-red-500">{uploadError}</div>
                        )}
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
                                className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-600"
                            >
                                {uploading ? 'Uploading...' : 'Submit'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
};

export default VideoModal;
