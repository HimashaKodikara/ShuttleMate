import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTable } from 'react-table';
import { Pencil, Trash2 } from 'lucide-react';
import ItemModal from '../components/ItemModel';

const ShopTable = ({ shops = [], onDelete, onAddItem }) => {
    const [expandedShop, setExpandedShop] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedShop, setSelectedShop] = useState(null);

    const toggleExpand = (shopId) => {
        setExpandedShop(expandedShop === shopId ? null : shopId);
    };

    const openModal = (shop) => {
        setSelectedShop(shop);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const columns = React.useMemo(
        () => [
            { Header: 'Shop Photo', accessor: 'ShopPhoto',
                Cell: ({ row }) => (
                    <img
                        src={row.original.ShopPhoto}
                        alt={row.original.ShopName}
                        className="object-cover w-12 h-12 rounded-full"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                    />
                )
            },
            { Header: 'Shop Name', accessor: 'ShopName' },
            { Header: 'Place', accessor: 'place' },
            { Header: 'Contact', accessor: 'Tel' },
           
            {
                Header: 'Actions',
                Cell: ({ row }) => (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => toggleExpand(row.original._id)}
                            className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                        >
                            {expandedShop === row.original._id ? 'Hide' : 'View'} Categories
                        </button>
                        <button
                            onClick={() => onDelete(row.original._id)}
                            className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                )
            }
        ],
        [onDelete, expandedShop]
    );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: shops });

    return (
        <div className="px-20 py-4 overflow-x-auto">
            <table {...getTableProps()} className="min-w-full shadow-lg text te ounded-lg bg-slate-900">
                <thead className="text-white bg-blue-900 ">
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()} className="px-6 py-3">
                                    {column.render('Header')}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()} className='text-slate-50'>
                    {rows.map(row => {
                        prepareRow(row);
                        return (
                            <React.Fragment key={row.id}>
                                <tr {...row.getRowProps()} className="border-b hover:bg-gray-100">
                                    {row.cells.map(cell => (
                                        <td {...cell.getCellProps()} className="px-6 py-3">
                                            {cell.render('Cell')}
                                        </td>
                                    ))}
                                </tr>
                                {expandedShop === row.original._id && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-3">
                                            <div className="p-4 border rounded-lg">
                                                <h3 className="mb-3 text-lg font-semibold">Categories</h3>
                                                {row.original.categories?.length > 0 ? (
                                                    <div className="space-y-4">
                                                        {row.original.categories.map(category => (
                                                            <div key={category._id} className="p-3 border rounded">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <h4 className="font-medium">{category.categoryName}</h4>
                                                                    <button
                                                                        onClick={() => onAddItem(row.original, category)}
                                                                        className="px-3 py-1 text-white bg-green-500 rounded hover:bg-green-600"
                                                                    >
                                                                        Add Item
                                                                    </button>
                                                                </div>
                                                                {category.items?.length > 0 ? (
                                                                    <div className="mt-2">
                                                                        <h5 className="mb-1 font-medium">Items:</h5>
                                                                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                                                            {category.items.map((item, index) => (
                                                                                <div key={index} className="p-2 border rounded">
                                                                                    {item.itemphoto && (
                                                                                        <img
                                                                                            src={item.itemphoto}
                                                                                            alt={item.name}
                                                                                            className="object-cover w-full h-24 mb-2 rounded"
                                                                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                                                                                        />
                                                                                    )}
                                                                                    <p className="font-medium">{item.name}</p>
                                                                                    {item.price && <p>Price: ${Number(item.price).toFixed(2)}</p>}
                                                                                    {item.color && <p>Color: {item.color}</p>}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <p className="text-sm text-gray-500">No items in this category.</p>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-500">No categories found.</p>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
            <ItemModal isOpen={isModalOpen} onClose={closeModal} onAddItem={onAddItem} selectedShop={selectedShop} />
        </div>
    );
};

ShopTable.propTypes = {
    shops: PropTypes.array.isRequired,
    onDelete: PropTypes.func.isRequired,
    onAddItem: PropTypes.func.isRequired
};

export default ShopTable;
