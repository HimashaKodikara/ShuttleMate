import React from 'react';
import { useTable } from 'react-table';
import PropTypes from 'prop-types';

const CoacherTable = ({ coachers = [], onDelete }) => {
    const columns = React.useMemo(
        () => [
            {
                Header: 'ID',
                accessor: '_id',
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
                    <button className="px-4 py-1 font-bold text-white bg-blue-500 rounded hover:bg-blue-600">
                        Edit
                    </button>
                ),
            },
            {
                Header: 'Delete',
                Cell: ({ row }) => (
                    <button
                        className="px-4 py-1 font-bold text-white bg-red-500 rounded hover:bg-red-600"
                        onClick={() => row.original && row.original._id && onDelete(row.original._id)}
                    >
                        Delete
                    </button>
                ),
            },
        ],
        [onDelete] // Add onDelete as a dependency
    );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: coachers });

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
        </div>
    );
};

CoacherTable.propTypes = {
    coachers: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            CoachName: PropTypes.string.isRequired,
            TrainingType: PropTypes.string.isRequired,
            Tel: PropTypes.string.isRequired,
        })
    ).isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default CoacherTable;