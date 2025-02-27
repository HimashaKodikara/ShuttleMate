import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '../components/shopModel';
import ShopTable from '../components/shopTable';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/firebaseconfig';
import Swal from 'sweetalert2';
import Navbar from '../components/Navbar';
import ItemModal from '../components/ItemModel';

const Shop = () => {
    const [shops, setShops] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [selectedShop, setSelectedShop] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [formData, setFormData] = useState({
        ShopName: '',
        place: '',
        Tel: '',
        website: '',
        categories: [{ categoryName: '', items: [{ itemphoto:'', name: '', price: '', color:'' }] }],
        ShopPhoto: null,
    });
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [step, setStep] = useState(1);

    const fetchShops = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/shops');
            console.log("Fetched shops data:", response.data.shops);
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

    const handleCategoryChange = (index, e) => {
        const { value } = e.target;
        setFormData((prev) => {
            const updatedCategories = prev.categories.map((category, i) =>
                i === index ? { ...category, categoryName: value } : category
            );
            return { ...prev, categories: updatedCategories };
        });
    };
    
    const handleItemChange = (catIndex, itemIndex, e) => {
        const { name, value } = e.target;
        const updatedCategories = [...formData.categories];
        updatedCategories[catIndex].items[itemIndex][name] = value;
        setFormData((prev) => ({
            ...prev,
            categories: updatedCategories,
        }));
    };

    const addCategory = () => {
        setFormData((prev) => ({
            ...prev,
            categories: [...prev.categories, { categoryName: '', items: [{itemphoto:'', name: '', price: '', color:'' }] }],
        }));
    };

    const removeCategory = (index) => {
        const updatedCategories = [...formData.categories];
        updatedCategories.splice(index, 1);
        setFormData((prev) => ({
            ...prev,
            categories: updatedCategories,
        }));
    };

    const addItem = (catIndex) => {
        const updatedCategories = [...formData.categories];
        // Remove the undefined categoryId that was causing errors
        updatedCategories[catIndex].items.push({ itemphoto:'', name: '', price: '', color:'' });
        setFormData((prev) => ({
            ...prev,
            categories: updatedCategories,
        }));
    };

    const removeItem = (catIndex, itemIndex) => {
        const updatedCategories = [...formData.categories];
        updatedCategories[catIndex].items.splice(itemIndex, 1);
        setFormData((prev) => ({
            ...prev,
            categories: updatedCategories,
        }));
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
        setStep(1);
    };

    // Open the item modal with a specific shop and category
    const openItemModal = (shop, category) => {
        console.log("Opening item modal for shop:", shop._id);
        console.log("Selected Category:", category);

        setSelectedShop(shop);
        setSelectedCategory(category);
        setIsItemModalOpen(true);
    };

    // Function to handle adding a new item via API
    const handleAddItem = async (newItem) => {
        try {
            console.log("Adding new item:", newItem);
            
            // After successful item addition, fetch fresh data
            await fetchShops();
            
            Swal.fire({
                title: 'Success!',
                text: 'Item added successfully.',
                icon: 'success',
                confirmButtonText: 'Okay'
            });
        } catch (error) {
            console.error('Error after adding item:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to refresh shop data.',
                icon: 'error'
            });
        }
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
                        // Fix: Remove the categoryId reference that doesn't exist
                        const categoriesWithFixedItems = formData.categories.map(category => ({
                            ...category,
                            items: category.items.map(item => ({
                                itemphoto: item.itemphoto,
                                name: item.name,
                                price: item.price,
                                color: item.color
                            }))
                        }));
                        
                        const newShop = { 
                            ...formData, 
                            ShopPhoto: downloadURL,
                            categories: categoriesWithFixedItems 
                        };
                        
                        axios.post('http://localhost:5000/api/shops', newShop)
                            .then(() => {
                                fetchShops();
                                setFormData({
                                    ShopName: '',
                                    place: '',
                                    Tel: '',
                                    website: '',
                                    categories: [{ categoryName: '', items: [{ itemphoto:'', name: '', price: '', color:'' }] }],
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
        // Check if shop exists
        if (!shops.find(shop => shop._id === id)) {
            Swal.fire({
                title: "Error!",
                text: "Shop not found.",
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
                await axios.delete(`http://localhost:5000/api/shops/shop/${id}`);
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
        
        <div className="h-screen  bg-slate-950">
            <Navbar />
            <h1 className='pt-5 text-4xl font-bold text-center text-white'>Shops</h1>
            <div className="flex justify-end mx-20">
                <button onClick={toggleModal} className="px-4 py-2 mb-4 text-white rounded bg-amber-500 hover:bg-yellow-400">
                    Add New Shop
                </button>
            </div>
            <ShopTable 
                shops={shops} 
                onDelete={handleDeleteShop} 
                onAddItem={openItemModal}
            />
            <Modal
                isOpen={isModalOpen}
                step={step}
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                toggleModal={toggleModal}
                addCategory={addCategory}
                removeCategory={removeCategory}
                handleCategoryChange={handleCategoryChange}
                addItem={addItem}
                removeItem={removeItem}
                handleItemChange={handleItemChange}
                uploadError={uploadError}
                setStep={setStep}
            />
            
            <ItemModal 
                isOpen={isItemModalOpen}
                onClose={() => setIsItemModalOpen(false)}
                onAddItem={handleAddItem}
                selectedShop={selectedShop}
                selectedCategory={selectedCategory}
            />
        </div>
    );
};

export default Shop;