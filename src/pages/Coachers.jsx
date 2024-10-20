import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '../components/CoachModel';
import CoacherTable from '../components/CoachTable';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/firebaseconfig'; 

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

            const storageRef = ref(storage, `images/coaches/${formData.CoachPhoto.name}`);
            const uploadTask = uploadBytesResumable(storageRef, formData.CoachPhoto);

            uploadTask.on(
                'state_changed',
                (snapshot) => {},
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

    return (
        <div className="text-center">
            <h1 className="mt-8 mb-6 text-2xl font-bold text-slate-300">Coachers</h1>
            <div className="flex justify-end mx-20">
                <button onClick={toggleModal} className="px-4 py-2 mb-4 text-white bg-blue-500 rounded hover:bg-blue-600">
                    Add New Coacher
                </button>
            </div>
            <CoacherTable coachers={coachers} />
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
