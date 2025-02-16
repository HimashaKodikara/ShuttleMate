import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '../components/shopModel';
import ShopTable from '../components/shopTable';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/firebaseconfig';
import Swal from 'sweetalert2';
import Navbar from '../components/Navbar';

const Shop = () => {
    const [shops, setShops] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        ShopName: '',
        place: '',
        Tel: '',
        website: '',
        items: [{ name: '', quantity: '' }], // Properly structured items array
        ShopPhoto: null,
    });
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [step, setStep] = useState(1);

    const fetchShops = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/shops');
            setShops(response.data.shops);
        } catch (error) {
            console.error("Error fetching shops:", error);
        }
    };

    useEffect(() => {
        fetchShops();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        const updatedItems = [...formData.items];
        updatedItems[index][name] = value;
        setFormData((prev) => ({
            ...prev,
            items: updatedItems,
        }));
    };

    const addItem = () => {
        setFormData((prev) => ({
            ...prev,
            items: [...prev.items, { name: '', quantity: '' }],
        }));
    };

    const removeItem = (index) => {
        const updatedItems = [...formData.items];
        updatedItems.splice(index, 1);
        setFormData((prev) => ({
            ...prev,
            items: updatedItems,
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
            if (!formData.ShopPhoto) {
                setUploadError('Please upload a shop photo.');
                return;
            }

            setUploading(true);
            setUploadError('');

            const storageRef = ref(storage, `shops/${formData.ShopPhoto.name}`);
            const uploadTask = uploadBytesResumable(storageRef, formData.ShopPhoto);

            uploadTask.on(
                'state_changed',
                () => {},
                (error) => {
                    setUploadError('Failed to upload the shop photo.');
                    setUploading(false);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        const newShop = { ...formData, ShopPhoto: downloadURL };
                        axios.post('http://localhost:5000/api/shops', newShop)
                            .then(() => {
                                fetchShops();
                                setFormData({
                                    ShopName: '',
                                    place: '',
                                    Tel: '',
                                    website: '',
                                    items: [{ name: '', quantity: '' }],
                                    ShopPhoto: null,
                                });
                                setIsModalOpen(false);
                                setUploading(false);

                                Swal.fire({
                                    title: 'Success!',
                                    text: 'Shop added successfully.',
                                    icon: 'success',
                                    confirmButtonText: 'Okay'
                                });
                            })
                            .catch((error) => {
                                console.error('Error adding shop:', error);
                                setUploading(false);
                            });
                    });
                }
            );
        }
    };

    const handleDeleteShop = async (id) => {
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
                await axios.delete(`http://localhost:5000/api/shops/${id}`);
                setShops(shops.filter(shop => shop._id !== id));

                Swal.fire({
                    title: "Deleted!",
                    text: "Shop has been deleted.",
                    icon: "success"
                });
            }
        } catch (error) {
            console.error("Error deleting shop:", error);
            Swal.fire({
                title: "Error!",
                text: "Failed to delete the shop.",
                icon: "error"
            });
        }
    };

    return (
        <div className="h-screen bg-slate-950">
            <Navbar />

            <h1 className='pt-5 text-4xl font-bold text-center text-white'>Shops</h1>
            <div className="flex justify-end mx-20">
                <button onClick={toggleModal} className="px-4 py-2 mb-4 text-white rounded bg-amber-500 hover:bg-yellow-400">
                    Add New Shop
                </button>
            </div>
            <ShopTable shops={shops} onDelete={handleDeleteShop} />
            <Modal
                isOpen={isModalOpen}
                step={step}
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                toggleModal={toggleModal}
                addItem={addItem}
                removeItem={removeItem}
                handleItemChange={handleItemChange}
                uploadError={uploadError}
                setStep={setStep}
            />
        </div>
    );
};

export default Shop;
