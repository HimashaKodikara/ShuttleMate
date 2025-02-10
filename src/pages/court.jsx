import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '../components/CoachModel';
import CourtTable from '../components/CourtTable';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/firebaseconfig'; 
import Swal from 'sweetalert2'; 
import Navbar from '../components/Navbar';

const court = () => {
    const [courts, setCourts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        CourtName: '',
        Tel: '',
        place: '',
        Directions: '',
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

  
   
      
    

    return (
        <div className="h-screen bg-slate-950">
            <Navbar/>
            
            <h1 className='pt-5 text-4xl font-bold text-center text-white'>Courts</h1>
            <div className="flex justify-end mx-20">
               
            </div>
            <import CourtTable court={courts} />
           
        </div>
    );
};

export default court;
