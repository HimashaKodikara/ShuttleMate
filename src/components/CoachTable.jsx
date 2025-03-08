import React, { useState } from 'react';
import { useTable } from 'react-table';
import PropTypes from 'prop-types';
import { Pencil, Trash2 } from 'lucide-react';
import EditCoachModal from './EditCoachModel';  // Import the modal component

const CoacherTable = ({ coachers = [], onDelete, onUpdate }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCoacher, setSelectedCoacher] = useState(null);
    const [step, setStep] = useState(1);

    const columns = React.useMemo(
        () => [
            {
                Header: 'Coach Photo',
                accessor: 'CoachPhoto',
                Cell: ({ row }) => (
                    <img
                        src={row.original.CoachPhoto}
                        alt={row.original.CoachName}
                        className="object-cover w-12 h-12 mx-auto rounded-full"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                    />
                ),
            },
            {
                Header: 'Name',
                accessor: 'CoachName',
            },
            {
                Header: 'Training Type',
                accessor: 'TrainingType',
            },
            {
                Header: 'Tel',
                accessor: 'Tel',
            },
            {
                Header: 'Edit',
                Cell: ({ row }) => (
                    <button
                        className="px-4 py-1 font-bold text-blue-500 rounded hover:bg-blue-600"
                        onClick={() => {
                            setSelectedCoacher(row.original);
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
                        onClick={() => row.original && row.original._id && onDelete(row.original._id)}
                    >
                        <Trash2 size={18} />
                    </button>
                ),
            },
        ],
        [onDelete]
    );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
        columns,
        data: coachers,
    });

    // Close the modal
    const closeModal = () => {
        setModalOpen(false);
        setSelectedCoacher(null);
    };

    // Handle form submission (you can update the coacher's details here)
    const handleFormSubmit = (updatedCoacher) => {
        onUpdate(updatedCoacher); // Pass updated coach details to parent
        closeModal();
    };

    return (
        <div className="mx-20 overflow-x-auto">
            <table {...getTableProps()} className="min-w-full text-center rounded-lg shadow-lg bg-slate-800">
                <thead className="text-white bg-blue-900">
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()} className="px-1 py-4">
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
                            <tr key={row.id} {...row.getRowProps({ className: "border-b bg-slate-900 border-slate-700 hover:bg-slate-800" })}>
                                {row.cells.map(cell => (
                                    <td {...cell.getCellProps()} className="px-1 py-4">
                                        {cell.render('Cell')}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* Modal */}
            {modalOpen && selectedCoacher && (
    <EditCoachModal
        isOpen={modalOpen}
        step={step}  // Use the actual step state
        formData={selectedCoacher}
        handleChange={(e) => setSelectedCoacher({ ...selectedCoacher, [e.target.name]: e.target.value })}
        handleSubmit={(e) => {
            e.preventDefault();
            handleFormSubmit(selectedCoacher);
        }}
        toggleModal={closeModal}
        addTrainingArea={() => setSelectedCoacher({
            ...selectedCoacher,
            TrainingAreas: [...(selectedCoacher.TrainingAreas || []), { CourtName: '', Area: '' }]
        })}
        removeTrainingArea={(index) => {
            const updatedAreas = [...(selectedCoacher.TrainingAreas || [])];
            updatedAreas.splice(index, 1);
            setSelectedCoacher({ ...selectedCoacher, TrainingAreas: updatedAreas });
        }}
        handleTrainingAreaChange={(index, e) => {
            const updatedAreas = [...(selectedCoacher.TrainingAreas || [])];
            updatedAreas[index][e.target.name] = e.target.value;
            setSelectedCoacher({ ...selectedCoacher, TrainingAreas: updatedAreas });
        }}
        uploadError={''}
        setStep={setStep}  // Pass the actual setStep function
    />
)}
        </div>
    );
};

CoacherTable.propTypes = {
    coachers: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string,
            CoachName: PropTypes.string.isRequired,
            TrainingType: PropTypes.string.isRequired,
            Tel: PropTypes.string.isRequired,
            CoachPhoto: PropTypes.string,
            TrainingAreas: PropTypes.arrayOf(
                PropTypes.shape({
                    CourtName: PropTypes.string,
                    Area: PropTypes.string,
                })
            ).isRequired,
        })
    ).isRequired,
    onDelete: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
};

export default CoacherTable;
