import React, { useState } from 'react';
import CoachersForm from './CoachForm.jsx';

const Modal = ({ toggleModal, fetchCoachers, formData, setFormData }) => {
    const [step, setStep] = useState(1);

    const handleSubmit = async (formValues) => {
        // Handle form submission here, and after completion, close the modal and refresh data
        await fetchCoachers();
        toggleModal();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
                <CoachersForm
                    formData={formData}
                    setFormData={setFormData}
                    step={step}
                    setStep={setStep}
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    );
};

export default Modal;
