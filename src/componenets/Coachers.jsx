import React, { useEffect, useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/firebaseconfig'; 
import axios from 'axios';
import { useTable } from 'react-table';

const Coachers = () => {
    const [coachers, setCoachers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        CoachName: '',
        Tel: '',
        TrainingType: '',
        Certifications: '',
        TrainingAreas: [{ CourtName: '', Area: '' }],
        CoachPhoto: null,
    });
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [step, setStep] = useState(1); // Step state

    // Fetch coachers from the backend
    const fetchCoachers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/coachers');
            setCoachers(response.data.coachers);
        } catch (error) {
            console.error("Error fetching coachers:", error);
        }
    };

    useEffect(() => {
        fetchCoachers(); 
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleTrainingAreaChange = (index, e) => {
        const { name, value } = e.target;
        const updatedAreas = [...formData.TrainingAreas];
        updatedAreas[index][name] = value;
        setFormData((prev) => ({
            ...prev,
            TrainingAreas: updatedAreas,
        }));
    };

    const addTrainingArea = () => {
        setFormData((prev) => ({
            ...prev,
            TrainingAreas: [...prev.TrainingAreas, { CourtName: '', Area: '' }],
        }));
    };

    const removeTrainingArea = (index) => {
        const updatedAreas = formData.TrainingAreas.filter((_, i) => i !== index);
        setFormData((prev) => ({
            ...prev,
            TrainingAreas: updatedAreas,
        }));
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
        setStep(1); // Reset step when modal is closed
        setFormData({
            CoachName: '',
            Tel: '',
            TrainingType: '',
            Certifications: '',
            TrainingAreas: [{ CourtName: '', Area: '' }],
            CoachPhoto: null,
        }); // Reset form data
    };

    const uploadFile = async (file, folder) => {
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
                        console.log(`CoachPhoto URL:`, downloadURL);
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
            if (step === 1) {
                // Step 1: Validate and handle photo upload
                if (!formData.CoachPhoto) {
                    setUploadError('Please upload the coach photo.');
                    return;
                }

                // Upload Coach Photo
                const coachPhotoURL = await uploadFile(formData.CoachPhoto, 'coaches');
                
                // Store the photo URL in formData
                setFormData((prev) => ({ ...prev, CoachPhoto: coachPhotoURL }));

                // Move to Step 2
                setStep(2);
                return;
            }

            // Step 2: Send POST request to the backend
            const response = await axios.post('http://localhost:5000/api/coachers', {
                CoachPhoto: formData.CoachPhoto,
                CoachName: formData.CoachName,
                Tel: formData.Tel,
                TrainingType: formData.TrainingType,
                Certifications: formData.Certifications,
                TrainingAreas: formData.TrainingAreas,
            });

            console.log('Coacher saved:', response.data);
            fetchCoachers(); 
            toggleModal(); 
        } catch (error) {
            console.error('Error uploading or saving coacher:', error);
            setUploadError('An error occurred while saving the coacher. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const columns = React.useMemo(
        () => [
            {
                Header: 'Name',
                accessor: 'CoachName',
            },
            {
                Header: 'Training Type',
                accessor: 'TrainingType',
            },
            {
                Header: 'Tel',
                accessor: 'Tel',
            },
            {
                Header: 'Edit',
                Cell: ({ row }) => (
                    <button className="px-4 py-1 font-bold text-white bg-blue-500 rounded hover:bg-blue-600">
                        Edit
                    </button>
                ),
            },
            {
                Header: 'Delete',
                Cell: ({ row }) => (
                    <button className="px-4 py-1 font-bold text-white bg-red-500 rounded hover:bg-red-600">
                        Delete
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
    } = useTable({ columns, data: coachers });

    return (
        <div className='h-screen p-4 bg-slate-950'>
            <h1 className='pt-6 ml-16 font-serif text-2xl text-white'>Shuttlemate</h1>
            <h1 className='text-4xl font-bold text-center text-white'>Coachers</h1>

            <div className="flex justify-end mb-6 mr-20">
                <button
                    onClick={toggleModal}
                    className='px-5 py-2 text-lg font-semibold bg-yellow-500 text-slate-50 rounded-2xl hover:bg-yellow-600'
                >
                    Add New
                </button>
            </div>

            <div className="mx-20 overflow-x-auto">
                <table {...getTableProps()} className="min-w-full text-center rounded-lg shadow-lg bg-slate-800">
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
                                <tr {...row.getRowProps()} className="border-b bg-slate-900 border-slate-700 hover:bg-slate-800">
                                    {row.cells.map(cell => (
                                        <td {...cell.getCellProps()} className="px-1 py-4">{cell.render('Cell')}</td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
                        <h2 className="mb-4 text-2xl font-bold text-center">
                            {step === 1 ? 'Add New Coacher - Step 1' : 'Add New Coacher - Step 2'}
                        </h2>
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
                                        <label className="block mb-2 font-semibold">Training Type</label>
                                        <input
                                            type="text"
                                            name="TrainingType"
                                            value={formData.TrainingType}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2 font-semibold">Certifications</label>
                                        <input
                                            type="text"
                                            name="Certifications"
                                            value={formData.Certifications}
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
                                    {uploadError && <p className="text-red-500">{uploadError}</p>}
                                    <div className="flex justify-between">
                                        <button type="button" onClick={toggleModal} className="px-4 py-2 text-white bg-gray-500 rounded">
                                            Cancel
                                        </button>
                                        <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded">
                                            Next
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h3 className="mb-2 font-semibold">Training Areas</h3>
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
                    </div>
                </div>
            )}
        </div>
    );
};

export default Coachers;
