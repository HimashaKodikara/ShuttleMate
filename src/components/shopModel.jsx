import React from 'react';

const ShopModal = ({
    isOpen,
    formData,
    handleChange,
    handleCategoryChange,
    handleItemChange,
    handleSubmit,
    toggleModal,
    uploadError,
    addCategory,
    removeCategory,
    addItem,
    removeItem,
    step,
    setStep,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
                <h2 className="mb-4 text-2xl font-bold text-center">Add New Shop</h2>
                <form onSubmit={handleSubmit}>
                    {step === 1 ? (
                        <>
                            <div className="mb-4">
                                <label className="block mb-2 font-semibold">Shop Name</label>
                                <input
                                    type="text"
                                    name="ShopName"
                                    value={formData.ShopName}
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
                                <label className="block mb-2 font-semibold">Place</label>
                                <input
                                    type="text"
                                    name="place"
                                    value={formData.place}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2 font-semibold">Web Site</label>
                                <input
                                    type="text"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2 font-semibold">Shop Photo</label>
                                <input
                                    type="file"
                                    name="ShopPhoto"
                                    onChange={handleChange}
                                    accept="image/*"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="flex justify-between">
                                <button type="button" onClick={toggleModal} className="px-4 py-2 text-white bg-gray-500 rounded">Cancel</button>
                                <button type="button" onClick={() => setStep(2)} className="px-4 py-2 text-white bg-blue-500 rounded">Next</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <h3 className="mb-2 font-semibold">Shop Categories & Items</h3>
                            <div className="p-2 mb-4 overflow-y-auto border border-gray-300 rounded max-h-96">
                                {formData.categories.map((category, catIndex) => (
                                    <div key={catIndex} className="p-2 mb-4 border rounded">
                                        <label className="block mb-2 font-semibold">Category Name</label>
                                        <input
                                            type="text"
                                            name="categoryName"
                                            value={category.categoryName}
                                            onChange={(e) => handleCategoryChange(catIndex, e)}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded"
                                        />
                                        <button type="button" onClick={() => removeCategory(catIndex)} className="mt-2 text-red-500">Remove Category</button>
                                        <h4 className="mt-4 font-semibold">Items</h4>
                                        {category.items.map((item, itemIndex) => (
                                            <div key={itemIndex} className="mb-4">
                                                <label className="block mb-2 font-semibold">Item Photo</label>
                                                <input
                                                    type="file"
                                                    name="itemphoto"
                                                    onChange={(e) => handleItemChange(catIndex, itemIndex, e)}
                                                    required
                                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                                />
                                                <label className="block mb-2 font-semibold">Item Name</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={item.name}
                                                    onChange={(e) => handleItemChange(catIndex, itemIndex, e)}
                                                    required
                                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                                />
                                                <label className="block mb-2 font-semibold">Price</label>
                                                <input
                                                    type="text"
                                                    name="price"
                                                    value={item.price}
                                                    onChange={(e) => handleItemChange(catIndex, itemIndex, e)}
                                                    required
                                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                                />
                                                <label className="block mb-2 font-semibold">Color</label>
                                                <input
                                                    type="text"
                                                    name="color"
                                                    value={item.color}
                                                    onChange={(e) => handleItemChange(catIndex, itemIndex, e)}
                                                    required
                                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                                />
                                                <button type="button" onClick={() => removeItem(catIndex, itemIndex)} className="mt-2 text-red-500">Remove Item</button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => addItem(catIndex)} className="mb-4 text-blue-500">Add Item</button>
                                    </div>
                                ))}
                                <button type="button" onClick={addCategory} className="mb-4 text-blue-500">Add Category</button>
                            </div>
                            {uploadError && <p className="text-red-500">{uploadError}</p>}
                            <div className="flex justify-between">
                                <button type="button" onClick={() => setStep(1)} className="px-4 py-2 text-white bg-gray-500 rounded">Back</button>
                                <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded">Submit</button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ShopModal;
