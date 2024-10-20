import React from 'react';
import { useTable } from 'react-table';

const CoacherTable = ({ coachers }) => {
    const columns = React.useMemo(
        () => [
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
                    <button className="px-4 py-1 font-bold text-white bg-red-500 rounded hover:bg-red-600">
                        Delete
                    </button>
                ),
            },
        ],
        []
    );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: coachers });

    return (
        <div className="mx-20 overflow-x-auto">
            <table {...getTableProps()} className="min-w-full text-center rounded-lg shadow-lg bg-slate-800">
                <thead className="text-white bg-blue-900">
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()} className="px-1 py-4">{column.render('Header')}</th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()} className="text-slate-300">
                    {rows.map(row => {
                        prepareRow(row);
                        // Separate the key prop from the rest of the props
                        const { key, ...rowProps } = row.getRowProps();
                        return (
                            <tr key={key} {...rowProps} className="border-b bg-slate-900 border-slate-700 hover:bg-slate-800">
                                {row.cells.map(cell => (
                                    <td {...cell.getCellProps()} className="px-1 py-4">{cell.render('Cell')}</td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default CoacherTable;
