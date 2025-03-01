import React, { useEffect, useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/firebaseconfig';
import axios from 'axios';
import { useTable } from 'react-table';
import Navbar from '../components/Navbar';
import Swal from 'sweetalert2';
import { Pencil, Trash2 } from 'lucide-react';

const VideoPage = () => {
    const [videos, setVideos] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        imgUrl:'',
        videoName: '',
        videoCreator: '',
        videoFile: null,
        thumbnail: null,
    });
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');

    // Fetch videos from the backend
    const fetchVideos = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/videos');
            console.log(response);
            setVideos(response.data.videos);
        } catch (error) {
            console.error("Error fetching videos:", error);
        }
    };

    useEffect(() => {
        fetchVideos(); // Call the function when the component mounts
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const uploadFile = async (file, folder, filetype) => {
        const storageRef = ref(storage, `${folder}/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                },
                (error) => {
                    console.error('Error uploading file:', error);
                    setUploadError('Failed to upload files. Please try again.');
                    reject(error);
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        console.log(`${filetype} URL:`, downloadURL);
                        resolve(downloadURL);
                    } catch (error) {
                        console.error('Error getting download URL:', error);
                        setUploadError('Error getting file URL.');
                        reject(error);
                    }
                }
            );
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        setUploadError('');

        try {
            // Validate if files are uploaded
            if (!formData.videoFile || !formData.thumbnail) {
                setUploadError('Please upload both video and thumbnail.');
                return;
            }

            // Upload video and thumbnail
            const videoURL = await uploadFile(formData.videoFile, 'videos', 'videoFile');
            const thumbnailURL = await uploadFile(formData.thumbnail, 'thumbnails', 'thumbnail');

            // Send POST request to the backend
            const response = await axios.post(`http://localhost:5000/api/videos/`, {
                videoUrl: videoURL,
                imgUrl: thumbnailURL,
                videoName: formData.videoName,
                videoCreator: formData.videoCreator,
            });

            console.log('Video saved:', response.data);
            setFormData({ videoName: '', videoCreator: '', videoFile: null, thumbnail: null });
            fetchVideos(); // Refresh video list after upload
            toggleModal(); // Close modal
        } catch (error) {
            console.error('Error uploading or saving video:', error);
            setUploadError('An error occurred while saving the video. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    
    const handleDeleteVideo = async (id) => {
        console.log("Deleting video with ID:", id); // Debugging line
    
        if (!videos.find(video => video._id === id)) {
            Swal.fire({
                title: "Error!",
                text: "Video not found.",
                icon: "error"
            });
            return;
        }
    
        try {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Yes, delete it!"
            });
    
            if (result.isConfirmed) {
                await axios.delete(`http://localhost:5000/api/videos/${id}`);
                setVideos((prevVideos) => prevVideos.filter(video => video._id !== id)); // Update state
                Swal.fire({
                    title: "Deleted!",
                    text: "Video has been deleted.",
                    icon: "success"
                });
            }
        } catch (error) {
            console.error("Error deleting video:", error);
            Swal.fire({
                title: "Error!",
                text: "Failed to delete the video.",
                icon: "error"
            });
        }
    };

    const columns = React.useMemo(
        () => [
            {
                Header: 'Thumbnail',
                accessor: 'imgUrl',
                Cell: ({ row }) => (
                    <img
                        src={row.original.imgUrl}
                        alt={row.original.imgUrl}
                        className="object-cover w-12 h-12 mx-auto rounded-full"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                    />
                )},
            {
                Header: 'Name of Video',
                accessor: 'videoName',
            },
            {
                Header: 'Video By',
                accessor: 'videoCreator',
            },
            {
                Header: 'Created',
                accessor: 'createdAt'
            },
            {
                Header: 'Edit',
                Cell: ({ row }) => (
                    <button className="px-4 py-1 font-bold text-blue-500 duration-300 ease-in-out transform rounded tran-blsition hover:bg-blue-600 hover:scale-105">
                        <Pencil size={18}/>
                    </button>
                ),
            },
            {
                Header: 'Delete',
                Cell: ({ row }) => (
                    <button
                        onClick={() => handleDeleteVideo(row.original._id)}
                        className="px-4 py-1 font-bold text-red-500 transition duration-300 ease-in-out transform rounded hover:bg-red-600 hover:scale-105"
                    >
                        <Trash2 size={18}/>
                    </button>
                ),
            },
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data: videos });

    return (
        <div className='h-screen bg-slate-950'>
            <Navbar />
            <h1 className='pt-3 text-4xl font-bold text-center text-white'>Videos</h1>

            <div className="flex justify-end mb-6 mr-20">
                <button
                    onClick={toggleModal}
                    className="px-4 py-2 mb-4 text-white rounded bg-amber-500 hover:bg-yellow-400"
                >
                    Add New Video
                </button>
            </div>

            {/* Video list table using React Table */}
            <div className="mx-20 overflow-x-auto ">
                <table {...getTableProps()} className="min-w-full text-center rounded-lg shadow-lg table-auto bg-slate-800">
                    <thead className="text-white bg-blue-900">
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <th {...column.getHeaderProps()} className="px-1 py-4">{column.render('Header')}</th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()} className="text-slate-300">
                        {rows.map(row => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()} className="transition duration-300 ease-in-out border-b bg-slate-900 border-slate-700 hover:bg-slate-800">
                                    {row.cells.map(cell => (
                                        <td {...cell.getCellProps()} className="px-1 py-4">{cell.render('Cell')}</td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Modal for adding new video */}
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
            )}
        </div>
    );
};

export default VideoPage;