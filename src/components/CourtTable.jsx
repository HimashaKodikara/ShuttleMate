import React, { useState } from 'react';
import { useTable } from 'react-table';
import PropTypes from 'prop-types';
import { Pencil, Trash2 } from 'lucide-react';
import EditCourtModal from './EditCourtModel';

const CourtTable = ({ courts = [], onDelete, onUpdate }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCourt, setSelectedCourt] = useState(null);
    const [step, setStep] = useState(1);

    // Ensure onDelete and onUpdate are functions to prevent errors
    const safeOnDelete = typeof onDelete === 'function' ? onDelete : () => console.warn('onDelete is not a function');
    const safeOnUpdate = typeof onUpdate === 'function' ? onUpdate : () => console.warn('onUpdate is not a function');

    const columns = React.useMemo(() => [
        {
            Header: 'Court Photo',
            accessor: 'CourtPhoto',
            Cell: ({ row }) => (
                <img
                    src={row.original.CourtPhoto}
                    alt={row.original.CourtName}
                    className="object-cover w-12 h-12 mx-auto rounded-full"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                />
            )
        },
        {
            Header: 'Name Of the Court',
            accessor: 'CourtName',
        },
        {
            Header: 'Place',
            accessor: 'place',
        },
        {
            Header: 'Tel',
            accessor: 'Tel',
        },
        {
            Header: 'Edit',
            accessor: 'edit',
            Cell: ({ row }) => (
                <button 
                    className="px-4 py-1 font-bold text-blue-500 rounded hover:bg-blue-600"
                    onClick={() => {
                        setSelectedCourt(row.original);
                        setModalOpen(true);
                    }}
                >
                    <Pencil size={18} />
                </button>
            ),
        },
        { 
            Header: 'Delete',
            Cell: ({ row }) => (
                <button
                    className="px-4 py-1 font-bold text-red-500 hover:bg-red-600"
                    onClick={() => row.original && row.original._id && safeOnDelete(row.original._id)}
                >
                    <Trash2 size={18} />
                </button>
            ),
        },
    ], [safeOnDelete]);

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: courts });

    const closeModal = () => {
        setModalOpen(false);
        setSelectedCourt(null);
    };

    const handleFormSubmit = (updatedCourt) => {
        safeOnUpdate(updatedCourt);
        closeModal();
    };

    return (
        <div className="mx-20 overflow-x-auto">
            <table {...getTableProps()} className="min-w-full text-center rounded-lg shadow-lg bg-slate-800">
                <thead className="text-white bg-blue-900">
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()} className="px-1 py-4" key={column.id}>
                                    {column.render('Header')}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()} className="text-slate-300">
                    {rows.map(row => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()} className="bg-slate-900 hover:bg-slate-800" key={row.id}>
                                {row.cells.map(cell => (
                                    <td {...cell.getCellProps()} className="px-1 py-4" key={cell.column.id}>
                                        {cell.render('Cell')}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {modalOpen && selectedCourt && (
                <EditCourtModal
                    isOpen={modalOpen}
                    step={step}
                    setStep={setStep}
                    formData={selectedCourt}
                    handleChange={(e) => setSelectedCourt({ ...selectedCourt, [e.target.name]: e.target.value })}
                    handleSubmit={(e) => {
                        e.preventDefault();
                        handleFormSubmit(selectedCourt);
                    }}
                    toggleModal={closeModal}
                    addDirection={() => setSelectedCourt({
                        ...selectedCourt,
                        Directions: [...(selectedCourt.Directions || []), { latitude: '', longitude: '' }]
                    })}
                    removeDirection={(index) => {
                        const updatedDirections = [...(selectedCourt.Directions || [])];
                        updatedDirections.splice(index, 1);
                        setSelectedCourt({ ...selectedCourt, Directions: updatedDirections });
                    }}
                    handleDirectionsChange={(index, e) => {
                        const updatedDirections = [...(selectedCourt.Directions || [])];
                        updatedDirections[index][e.target.name] = e.target.value;
                        setSelectedCourt({ ...selectedCourt, Directions: updatedDirections });
                    }}
                    uploadError={''}
                />
            )}
        </div>
    );
};

CourtTable.propTypes = {
    courts: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string,
            CourtName: PropTypes.string.isRequired,
            Tel: PropTypes.string.isRequired,
            place: PropTypes.string.isRequired,
            Directions: PropTypes.arrayOf(
                PropTypes.shape({
                    latitude: PropTypes.string,
                    longitude: PropTypes.string,
                })
            ), // Made optional to prevent warnings
        })
    ).isRequired,
    onDelete: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
};

export default CourtTable;
