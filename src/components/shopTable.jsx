import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTable } from 'react-table';
import { Trash2 } from 'lucide-react';

const ShopTable = ({ shops = [], onDelete, onAddItem }) => {
    const [expandedShop, setExpandedShop] = useState(null);
    const [expandedCategories, setExpandedCategories] = useState({});
    const [categoryItems, setCategoryItems] = useState({});

    const toggleExpand = (shopId) => {
        setExpandedShop(expandedShop === shopId ? null : shopId);
    };

    const fetchItemsForCategory = async (categoryId) => {
        if (categoryItems[categoryId]) return; // Avoid fetching again if data already exists

        try {
            const response = await fetch(`http://localhost:5000/api/items/category/${categoryId}`);
            const data = await response.json();
            setCategoryItems((prev) => ({
                ...prev,
                [categoryId]: data,
            }));
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    const toggleCategoryExpand = (categoryId) => {
        setExpandedCategories((prev) => ({
            ...prev,
            [categoryId]: !prev[categoryId],
        }));

        if (!categoryItems[categoryId]) {
            fetchItemsForCategory(categoryId);
        }
    };

    const columns = React.useMemo(
        () => [
            {
                Header: 'Shop Photo',
                accessor: 'ShopPhoto',
                Cell: ({ row }) => (
                    <img
                        src={row.original.ShopPhoto}
                        alt={row.original.ShopName}
                        className="object-cover w-12 h-12 mx-auto rounded-full"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                    />
                )
            },
            { Header: 'Shop Name', accessor: 'ShopName', className: 'text-center' },
            { Header: 'Place', accessor: 'place', className: 'text-center' },
            { Header: 'Contact', accessor: 'Tel', className: 'text-center' },
            {
                Header: 'Actions',
                Cell: ({ row }) => (
                    <div className="flex justify-center space-x-2">
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
        <div className="px-4 py-4 overflow-x-auto md:px-20">
            <table {...getTableProps()} className="min-w-full rounded-lg shadow-lg bg-slate-900">
                <thead className="text-white bg-blue-900">
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()} className="px-6 py-3 text-center">
                                    {column.render('Header')}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()} className="justify-center align-middle text-slate-50">
                    {rows.map(row => {
                        prepareRow(row);
                        return (
                            <React.Fragment key={row.id}>
                                <tr {...row.getRowProps()} className="border-b hover:bg-slate-800">
                                    {row.cells.map(cell => (
                                        <td {...cell.getCellProps()} className="px-6 py-3 text-center">
                                            {cell.render('Cell')}
                                        </td>
                                    ))}
                                </tr>

                                {/* Expanded Categories */}
                                {expandedShop === row.original._id && (
                                    <tr>
                                        <td colSpan={columns.length} className="px-6 py-3">
                                            <div className="p-4 border rounded-lg bg-slate-800">
                                                <h3 className="mb-3 text-lg font-semibold text-center">
                                                    Categories for {row.original.ShopName}
                                                </h3>
                                                {row.original.categories && row.original.categories.length > 0 ? (
                                                    <div className="space-y-4">
                                                        {row.original.categories.map(category => (
                                                            <div key={category._id} className="p-3 border rounded bg-slate-700">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <h4 className="font-medium">{category.categoryName}</h4>
                                                                    <button
                                                                        onClick={() => toggleCategoryExpand(category._id)}
                                                                        className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                                                                    >
                                                                        {expandedCategories[category._id] ? 'Hide Items' : 'View Items'}
                                                                    </button>
                                                                    <button
                                                                        onClick={() => onAddItem(row.original, category)}
                                                                        className="px-3 py-1 text-white bg-green-500 rounded hover:bg-green-600"
                                                                    >
                                                                        Add Item
                                                                    </button>
                                                                </div>

                                                                {/* Expanded Items under Category */}
                                                                {expandedCategories[category._id] && (
                                                                    <div className="mt-2 space-y-2">
                                                                        {categoryItems[category._id] ? (
                                                                            categoryItems[category._id].length > 0 ? (
                                                                                categoryItems[category._id].map(item => (
                                                                                    <div key={item._id} className="p-2 border rounded bg-slate-600">
                                                                                        <div className="">
                                                                                            <dev className="flex flex-row">  <p>Name :  </p>  <span>   {item.name}</span></dev>
                                                                                          <dev className="flex flex-row"> <p>Price :</p><span>{item.price}</span></dev>
                                                                                           
                                                                                            
                                                                                        </div>
                                                                                    </div>
                                                                                ))
                                                                            ) : (
                                                                                <p className="text-gray-400">No items found.</p>
                                                                            )
                                                                        ) : (
                                                                            <p className="text-gray-400">Loading items...</p>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-400">No categories found.</p>
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
        </div>
    );
};

ShopTable.propTypes = {
    shops: PropTypes.array,
    onDelete: PropTypes.func.isRequired,
    onAddItem: PropTypes.func.isRequired
};

export default ShopTable;
