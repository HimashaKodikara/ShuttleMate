import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '../components/CourtModel';
import CourtTable from '../components/CourtTable';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/firebaseconfig';
import Swal from 'sweetalert2';
import Navbar from '../components/Navbar';

const Courts = () => {
    const [courts, setCourts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        CourtName: '',
        Tel: '',
        place: '',
        Directions: [{ latitude: '', longitude: '' }],
        CourtPhoto: null,
    });
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [step, setStep] = useState(1);

    
    const fetchCourts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/courts');
            setCourts(response.data.courts);
        } catch (error) {
            console.error("Error fetching courts:", error);
        }
    };

    useEffect(() => {
        fetchCourts();
    }, []);

    
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };
    const handleDirectionsChange = (index, e) => {
        const { name, value } = e.target;
        const updatedDirections = [...formData.Directions];
        updatedDirections[index][name] = value;
        setFormData((prev) => ({
            ...prev,
            Directions: updatedDirections,
        }));
    };
    const addDirection = () => {
        setFormData((prev) => ({
            ...prev,
            Directions: [...prev.Directions, { latitude: '', longitude: '' }],
        }));
    };

   
    const removeDirection = (index) => {
        const updatedDirections = [...formData.Directions];
        updatedDirections.splice(index, 1);
        setFormData((prev) => ({
            ...prev,
            Directions: updatedDirections,
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
            if (!formData.CourtPhoto) {
                setUploadError('Please upload a court photo.');
                return;
            }

            setUploading(true);
            setUploadError('');

            
            const storageRef = ref(storage, `courts/${formData.CourtPhoto.name}`);
            const uploadTask = uploadBytesResumable(storageRef, formData.CourtPhoto);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    
                },
                (error) => {
                    setUploadError('Failed to upload the court photo.');
                    setUploading(false);
                },
                () => {
                   
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        const newCourt = {
                            ...formData,
                            CourtPhoto: downloadURL,
                        };

                       
                        axios.post('http://localhost:5000/api/courts', newCourt)
                            .then(() => {
                                fetchCourts();
                                setFormData({
                                    CourtName: '',
                                    Tel: '',
                                    place: '',
                                    Directions: [{ latitude: '', longitude: '' }],
                                    CourtPhoto: null,
                                });
                                setIsModalOpen(false);
                                setUploading(false);


                                Swal.fire({
                                    title: 'Success!',
                                    text: 'Court added successfully.',
                                    icon: 'success',
                                    confirmButtonText: 'Okay',
                                });
                                console.log(formData);
                            })
                            .catch((error) => {
                                console.error('Error adding court:', error);
                                setUploading(false);
                            });
                    });
                }
            );
        }
    };

    return (
        <div className="h-full bg-slate-950">
            <Navbar />
            <h1 className="pt-5 text-4xl font-bold text-center text-white">Courts</h1>
            <div className="flex justify-end mx-20">
                <button
                    onClick={toggleModal}
                    className="px-4 py-2 mb-4 text-white rounded bg-amber-500 hover:bg-yellow-400"
                >
                    Add New Court
                </button>
            </div>
            <CourtTable courts={courts} />
            <Modal
                isOpen={isModalOpen}
                step={step}
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                toggleModal={toggleModal}
                addDirection={addDirection}
                removeDirection={removeDirection}
                handleDirectionsChange={handleDirectionsChange}
                uploadError={uploadError}
                setStep={setStep}
            />
        </div>
    );
};

export default Courts;