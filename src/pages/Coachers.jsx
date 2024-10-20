import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CoachersTable from '../components/CoachTable';
import Modal from '../components/CoachModel';

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

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

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

            <CoachersTable coachers={coachers} />

            {isModalOpen && (
                <Modal
                    toggleModal={toggleModal}
                    fetchCoachers={fetchCoachers}
                    formData={formData}
                    setFormData={setFormData}
                />
            )}
        </div>
    );
};

export default Coachers;
