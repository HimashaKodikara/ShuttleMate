import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '../components/CoachModel';
import CoacherTable from '../components/CoachTable';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/firebaseconfig';
import Swal from 'sweetalert2';
import Navbar from '../components/Navbar';

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
    const [step, setStep] = useState(1);


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
        const updatedAreas = [...formData.TrainingAreas];
        updatedAreas.splice(index, 1);
        setFormData((prev) => ({
            ...prev,
            TrainingAreas: updatedAreas,
        }));
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
        setStep(1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (step === 1) {
            setStep(2);
        } else {
            if (!formData.CoachPhoto) {
                setUploadError('Please upload a coach photo.');
                return;
            }

            setUploading(true);
            setUploadError('');

            const storageRef = ref(storage, `coaches/${formData.CoachPhoto.name}`);
            const uploadTask = uploadBytesResumable(storageRef, formData.CoachPhoto);

            uploadTask.on(
                'state_changed',
                (snapshot) => { },
                (error) => {
                    setUploadError('Failed to upload the coach photo.');
                    setUploading(false);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        const newCoacher = { ...formData, CoachPhoto: downloadURL };
                        axios.post('http://localhost:5000/api/coachers', newCoacher)
                            .then(() => {
                                fetchCoachers();
                                setFormData({
                                    CoachName: '',
                                    Tel: '',
                                    TrainingType: '',
                                    Certifications: '',
                                    TrainingAreas: [{ CourtName: '', Area: '' }],
                                    CoachPhoto: null,
                                });
                                setIsModalOpen(false);
                                setUploading(false);


                                Swal.fire({
                                    title: 'Success!',
                                    text: 'Coacher added successfully.',
                                    icon: 'success',
                                    confirmButtonText: 'Okay'
                                });
                            })
                            .catch((error) => {
                                console.error('Error adding coacher:', error);
                                setUploading(false);
                            });
                    });
                }
            );
        }
    };


    const handleDeleteCoacher = async (id) => {
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
                await axios.delete(`http://localhost:5000/api/Coachers/coach/${id}`);
                setCoachers(coachers.filter(coach => coach._id !== id));

                Swal.fire({
                    title: "Deleted!",
                    text: "Coacher has been deleted.",
                    icon: "success"
                });
            }
        } catch (error) {
            console.error("Error deleting coacher:", error);
            Swal.fire({
                title: "Error!",
                text: "Failed to delete the coacher.",
                icon: "error"
            });
        }
    };
    return (
        <div className="h-screen bg-slate-950">
            <Navbar />

            <h1 className='pt-5 text-4xl font-bold text-center text-white'>Coachers</h1>
            <div className="flex justify-end mx-20">
                <button onClick={toggleModal} className="px-4 py-2 mb-4 text-white rounded bg-amber-500 hover:bg-yellow-400">
                    Add New Coacher
                </button>
            </div>
            <CoacherTable coachers={coachers} onDelete={handleDeleteCoacher} />
            <Modal
                isOpen={isModalOpen}
                step={step}
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                toggleModal={toggleModal}
                addTrainingArea={addTrainingArea}
                removeTrainingArea={removeTrainingArea}
                handleTrainingAreaChange={handleTrainingAreaChange}
                uploadError={uploadError}
                setStep={setStep}
            />
        </div>
    );
};

export default Coachers;
